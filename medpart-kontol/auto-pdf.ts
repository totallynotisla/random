import fs from "fs-extra";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { config } from "dotenv";
config();

const IG_USERNAME = process.env.IG_USERNAME || "";
const OUTPUT_DIR = path.join(__dirname, "output");
const PDF_OUTPUT_DIR = path.join(__dirname, "pdf");

async function imagesToPdf(username: string) {
	const userDir = path.join(OUTPUT_DIR, username);
	if (!(await fs.pathExists(userDir))) {
		console.warn(`❌ Directory not found: ${userDir}`);
		return;
	}

	const files = await fs.readdir(userDir);

	// Match profile.png first, then post_1.png, post_2.png...
	const sortedImages = files
		.filter((f) => /\.(png|jpg|jpeg)$/i.test(f))
		.sort((a, b) => {
			if (a === "profile.png") return -1;
			if (b === "profile.png") return 1;

			const aMatch = a.match(/post_(\d+)/);
			const bMatch = b.match(/post_(\d+)/);

			if (aMatch && bMatch) {
				return parseInt(aMatch[1]) - parseInt(bMatch[1]);
			}

			return 0;
		});

	if (sortedImages.length === 0) {
		console.warn(`⚠️ No images found for ${username}`);
		return;
	}

	const pdf = await PDFDocument.create();

	for (const imgName of sortedImages) {
		const imgPath = path.join(userDir, imgName);
		const imgBytes = await fs.readFile(imgPath);

		let img, width, height;
		if (imgName.endsWith(".png")) {
			img = await pdf.embedPng(imgBytes);
		} else {
			img = await pdf.embedJpg(imgBytes);
		}

		width = img.width;
		height = img.height;

		const page = pdf.addPage([width, height]);
		page.drawImage(img, {
			x: 0,
			y: 0,
			width,
			height,
		});
	}

	await fs.ensureDir(path.join(PDF_OUTPUT_DIR, username));
	const outputPdfPath = path.join(PDF_OUTPUT_DIR, username, `@${IG_USERNAME}.pdf`);
	await fs.writeFile(outputPdfPath, await pdf.save());

	console.log(`✅ PDF saved: ${path.relative(process.cwd(), outputPdfPath)}`);
}

async function run() {
	await fs.ensureDir(PDF_OUTPUT_DIR);

	const users = await fs.readdir(OUTPUT_DIR);
	for (const username of users) {
		const fullPath = path.join(OUTPUT_DIR, username);
		if ((await fs.stat(fullPath)).isDirectory()) {
			await imagesToPdf(username);
		}
	}
}

run().catch((err) => {
	console.error("❌ Failed to generate PDFs:", err);
});
