// app.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const pdfBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(pdfBuffer);
    const text = data.text;

    // Extract data using regex
    const name = text.match(/Name[:\-]?\s*(.+)/i)?.[1]?.trim();
    const email = text.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/
    )?.[0];
    const phone = text.match(
      /(\+?\d{1,3}[\s\-]?)?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}/
    )?.[0];
    const skills = text.match(/Skills[:\-]?\s*(.+)/i)?.[1]?.trim();

    res.json({ name, email, phone, skills });
  } catch (err) {
    console.error("Parsing error:", err);
    res.status(500).json({ error: "Failed to parse resume" });
  }
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
