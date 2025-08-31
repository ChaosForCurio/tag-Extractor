async function extractTags() {
  const url = document.getElementById("youtubeUrl").value.trim();
  const output = document.getElementById("output");

  if (!url) {
    output.innerHTML = "⚠️ Please enter a YouTube URL.";
    return;
  }

  output.innerHTML = "⏳ Extracting tags...";

  try {
    const res = await fetch(
      `http://localhost:3000/tags?url=${encodeURIComponent(url)}`
    );
    const data = await res.json();

    if (data.tags && data.tags.length > 0) {
      output.innerHTML = `<b>Tags (${data.source}):</b> ${data.tags.join(
        ", "
      )}`;
    } else {
      output.innerHTML = "⚠️ No tags found (even with Puppeteer).";
    }
  } catch (err) {
    output.innerHTML = "❌ Error fetching tags.";
  }
}

tsParticles.load("tsparticles", {
  background: {
    color: "#0f172a",
  },
  particles: {
    number: { value: 60 },
    color: { value: "#38bdf8" },
    shape: { type: "circle" },
    opacity: { value: 0.6 },
    size: { value: { min: 2, max: 6 } },
    move: { enable: true, speed: 2 },
    links: {
      enable: true,
      color: "#38bdf8",
      distance: 120,
      opacity: 0.4,
    },
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
      onClick: { enable: true, mode: "push" },
    },
  },
});
