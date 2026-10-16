const fs = require("fs");
const html = fs.readFileSync("/tmp/gemini_share.html", "utf8");

// Look for data array or conversation in the html
const matches = [...html.matchAll(/AF_initDataCallback\(\{([\s\S]*?)\}\);/g)];
console.log("Total AF_initDataCallback:", matches.length);

for (let i = 0; i < matches.length; i++) {
  const content = matches[i][1];
  console.log(`\n--- Callback ${i} ---`);
  const key = content.match(/key:\s*['"]([^'"]+)['"]/);
  console.log("Key:", key ? key[1] : "no key");
  console.log("Length:", content.length);
  // look for data:
  const dataIdx = content.indexOf("data:");
  if (dataIdx !== -1) {
    const dataSnippet = content.substring(dataIdx, dataIdx + 500);
    console.log("Data snippet:", dataSnippet);
  }
}
