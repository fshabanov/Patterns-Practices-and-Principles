import { Router } from "express";
import path from "path";
import { HTML_FILES_PATH } from "../config";
import data from "../data";

const router = Router();

router.get("/", (req, res) => {
	const page = path.join(HTML_FILES_PATH, "game.html");
	res.sendFile(page);
});

router.get("/texts/:id", (req, res) => {
	const { id } = req.params;
	const text = data.texts[id];
	if (!text) {
		res.status(404).send("Text with this id not found");
		return;
	}
	res.json({ text });
});

export default router;
