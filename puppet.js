const puppeteer = require("puppeteer");

async function checkVideoRank(keyword, videoUrl, maxPages = 3) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  let rank = null;
  let results = [];

  try {
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const start = (pageNum - 1) * 20;
      await page.goto(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(
          keyword
        )}&sp=CAI%253D`,
        { waitUntil: "domcontentloaded" }
      );

      const videos = await page.$$eval("a#video-title", (links) =>
        links.map((el) => ({
          title: el.innerText.trim(),
          url: "https://www.youtube.com" + el.getAttribute("href"),
        }))
      );

      results.push(...videos);

      for (let i = 0; i < videos.length; i++) {
        if (videos[i].url.includes(videoUrl)) {
          rank = (pageNum - 1) * 20 + (i + 1);
          break;
        }
      }

      if (rank) break;
    }
  } catch (err) {
    console.error("Error checking rank:", err);
  }

  await browser.close();
  return { rank, results: results.slice(0, 20) };
}

module.exports = { checkVideoRank };
