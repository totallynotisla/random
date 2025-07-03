import puppeteer, { Browser, Page } from "puppeteer";
import fs from "fs-extra";
import path from "path";
import { config } from "dotenv";

config();

const IG_USERNAME = process.env.IG_USERNAME || "";
const IG_PASSWORD = process.env.IG_PASSWORD || "";
const SESSION_FILE = "temp-session.json";

async function delay(ms: number) {
	return new Promise((res) => setTimeout(res, ms));
}

async function likePost(postLinks: string[], handle: string, page: Page, folder: string, length: number, i: number = 0) {
	await page.goto(postLinks[i], { waitUntil: "networkidle2" });
	// await delay(2000);

	console.log(`Liking ${handle} ${i}...`);
	const likeBtn = await page.$('svg[aria-label="Like"]');
	if (likeBtn) {
		const box = await likeBtn.boundingBox();
		if (box) {
			await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
			await delay(100); // let hover effects settle
			await page.mouse.down();
			await delay(50); // simulate a short press
			await page.mouse.up();
		}
	}

	await delay(2000);
	await page.screenshot({ path: `${folder}/post_${i + 1}.png` });

	if (i < length - 1) {
		await likePost(postLinks, handle, page, folder, length, i + 1);
	} else {
		console.log(`✅ Done liking post: ${handle}`);
	}
}

async function saveSession(page: Page, filePath: string) {
	const client = await page.target().createCDPSession();
	const { cookies } = await client.send("Network.getAllCookies");

	const localStorage = await page.evaluate(() => {
		const data: Record<string, string> = {};
		for (let i = 0; i < window.localStorage.length; i++) {
			const key = window.localStorage.key(i);
			if (key) {
				const value = window.localStorage.getItem(key);
				if (value !== null) data[key] = value;
			}
		}
		return data;
	});

	await fs.writeJSON(filePath, { cookies, localStorage });
}

async function loadSession(page: Page, filePath: string) {
	if (!(await fs.pathExists(filePath))) return;

	const { cookies, localStorage } = await fs.readJSON(filePath);
	const client = await page.target().createCDPSession();
	await client.send("Network.setCookies", { cookies });

	await page.goto("https://www.instagram.com", { waitUntil: "domcontentloaded" });

	await page.evaluate((data) => {
		for (const [key, value] of Object.entries(data)) {
			window.localStorage.setItem(key, String(value));
		}
	}, localStorage);
}

async function loginInstagram(page: Page) {
	await page.goto("https://www.instagram.com/accounts/login/", { waitUntil: "networkidle2" });
	await page.waitForSelector("input[name=username]", { timeout: 15000 });

	await page.type("input[name=username]", IG_USERNAME, { delay: 100 });
	await page.type("input[name=password]", IG_PASSWORD, { delay: 100 });
	await page.click("button[type=submit]");
	await page.waitForNavigation({ waitUntil: "networkidle2" });

	await delay(3000); // dismiss possible popups
}

async function processHandle(browser: Browser, handle: string) {
	const page = await browser.newPage();
	const username = handle.replace("@", "");
	const folder = path.join(__dirname, "output", username);
	await fs.ensureDir(folder);

	const profileUrl = `https://www.instagram.com/${username}/`;

	try {
		await page.goto(profileUrl, { waitUntil: "networkidle2" });
		await page.waitForSelector("img", { timeout: 10000 });

		// Click "Follow" if available
		const buttons = await page.$$("button");

		for (const btn of buttons) {
			const text = await page.evaluate((el) => el.textContent?.trim(), btn);
			if (text.toLowerCase().includes("follow")) {
				console.log(`Following ${handle}...`);
				await btn.click();
				// await delay(3000);
				break;
			}
		}

		await page.screenshot({ path: `${folder}/profile.png` });

		// Like first 5 posts and screenshot them
		const postLinks = await page.$$eval(`a[href^="/${username}/p/"]`, (els) => els.slice(0, 5).map((a) => (a as HTMLAnchorElement).href));
		// console.log(`Found ${postLinks.length} posts for ${handle}.`);

		await likePost(postLinks, handle, page, folder, postLinks.length);

		// }

		// for (let i = 0; i < postLinks.length; i++) {
		// 	await page.goto(postLinks[i], { waitUntil: "networkidle2" });
		// 	// await delay(2000);

		// 	console.log(`Liking ${handle} ${i}...`);
		// 	const likeBtn = await page.$('span:has(svg[aria-label="Like"])');
		// 	if (likeBtn) await likeBtn.click().then;

		// 	await delay(3000);
		// 	await page.screenshot({ path: `${folder}/post_${i + 1}.png` });
		// }

		// Optional unfollow logic (commented out)
		/*
		await page.goto(profileUrl, { waitUntil: "networkidle2" });
		await delay(3000);
		const buttonsAfter = await page.$$("button");
		for (const btn of buttonsAfter) {
			const text = await page.evaluate(el => el.textContent?.trim(), btn);
			if (text === "Following") {
				await btn.click();
				await delay(1000);
				const unfollowBtns = await page.$$("button");
				for (const ub of unfollowBtns) {
					const txt = await page.evaluate(el => el.textContent?.trim(), ub);
					if (txt === "Unfollow") {
						await ub.click();
						break;
					}
				}
				break;
			}
		}
		*/

		console.log(`✅ Done: ${handle}`);
	} catch (err) {
		console.error(`❌ Error with ${handle}:`, (err as Error).message);
	} finally {
		await page.close();
	}
}

(async () => {
	const browser = await puppeteer.launch({
		headless: false,
		executablePath: process.env.BROWSER_PATH || "/usr/bin/google-chrome",
		defaultViewport: null,
		args: ["--start-maximized"],
	});

	const page = await browser.newPage();
	await loadSession(page, SESSION_FILE);

	await page.goto("https://www.instagram.com", { waitUntil: "networkidle2" });

	const isLogin = await page.$("input[name=username]");
	if (isLogin) {
		console.log("🔒 Not logged in. Logging in...");
		await loginInstagram(page);
		await saveSession(page, SESSION_FILE);
	} else {
		console.log("✅ Logged in via saved session.");
	}

	const txt = await fs.readFile("handles.txt", "utf-8");
	const handles = txt
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean);

	for (const handle of handles) {
		await processHandle(browser, handle);
		await delay(5000); // avoid rate limit
	}

	await browser.close();
})();
