import puppeteer, { Browser, Page } from "puppeteer";
import fs from "fs-extra";
import path from "path";

const IG_USERNAME = "your_instagram_username";
const IG_PASSWORD = "your_instagram_password";

const CHROME_PATH = "/usr/bin/google-chrome"; // <-- change this for your OS

async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loginInstagram(page: Page) {
    await page.goto("https://www.instagram.com/accounts/login/", { waitUntil: "networkidle2" });
    await page.waitForSelector("input[name=username]", { timeout: 15000 });

    await page.type("input[name=username]", IG_USERNAME, { delay: 100 });
    await page.type("input[name=password]", IG_PASSWORD, { delay: 100 });
    await page.click("button[type=submit]");
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    // Optional: dismiss "save login info" or notification popups
    await delay(3000);
}

async function processHandle(browser: Browser, handle: string) {
    const page = await browser.newPage();
    const folder = path.join(__dirname, "..", "output", handle.replace("@", ""));
    await fs.ensureDir(folder);

    const username = handle.replace("@", "");
    const profileUrl = `https://www.instagram.com/${username}/`;

    try {
        await page.goto(profileUrl, { waitUntil: "networkidle2" });
        await page.waitForSelector("img", { timeout: 10000 }); // Ensure page loaded

        await page.screenshot({ path: `${folder}/profile.png`, fullPage: true });

        // Follow if button says "Follow"
        const [followBtn] = await page.$x("//button[text()='Follow']");
        if (followBtn) {
            await followBtn.click();
            await delay(3000);
        }

        // Click 5 posts, like, and screenshot
        const postLinks = await page.$$eval('article a[href^="/p/"]', (els) => els.slice(0, 5).map((a) => (a as HTMLAnchorElement).href));

        for (let i = 0; i < postLinks.length; i++) {
            await page.goto(postLinks[i], { waitUntil: "networkidle2" });
            await delay(2000);

            // Like if not already liked
            const likeBtn = await page.$('svg[aria-label="Like"]');
            if (likeBtn) await likeBtn.click();

            await delay(1000);
            await page.screenshot({ path: `${folder}/post_${i + 1}.png`, fullPage: true });
        }

        // Unfollow
        await page.goto(profileUrl, { waitUntil: "networkidle2" });
        await delay(3000);

        const [followingBtn] = await page.$x("//button[text()='Following']");
        if (followingBtn) {
            await followingBtn.click();
            await delay(1000);
            const [unfollowBtn] = await page.$x("//button[text()='Unfollow']");
            if (unfollowBtn) await unfollowBtn.click();
        }

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
        executablePath: CHROME_PATH,
        defaultViewport: null,
        args: ["--start-maximized"],
    });

    const page = await browser.newPage();
    await loginInstagram(page);

    const txt = await fs.readFile("handles.txt", "utf-8");
    const handles = txt
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    for (const handle of handles) {
        await processHandle(browser, handle);
        await delay(5000); // Avoid rate limit
    }

    await browser.close();
})();
