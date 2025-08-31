const express = require("express");
const axios = require("axios");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
app.use(cors());

async function extractWithCheerio(url) {
  try {
    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const html = response.data;

    const match = html.match(/<meta name="keywords" content="([^"]+)"/);
    if (match && match[1]) {
      return {
        tags: match[1].split(",").map((t) => t.trim()),
        source: "cheerio",
      };
    }
    return { tags: [], source: "cheerio" };
  } catch (err) {
    return { tags: [], source: "cheerio" };
  }
}

async function extractWithPuppeteer(url) {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2" });

    const tags = await page.evaluate(() => {
      const meta = document.querySelector("meta[name=keywords]");
      if (meta) {
        return meta.content.split(",").map((t) => t.trim());
      }
      return [];
    });

    return { tags, source: "puppeteer" };
  } catch (err) {
    return { tags: [], source: "puppeteer" };
  } finally {
    if (browser) await browser.close();
  }
}

app.get("/tags", async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ error: "YouTube URL required" });

  let result = await extractWithCheerio(videoUrl);

  if (result.tags.length === 0) {
    result = await extractWithPuppeteer(videoUrl);
  }

  res.json(result);
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
