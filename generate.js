import fs from 'fs';
import fetch from 'node-fetch';

const handle = 'jaehyeon3357';
const outputPath = '.badges/solvedac.svg';

async function fetchProfile() {
  const res = await fetch(`https://solved.ac/api/v3/search/user?query=${handle}`);
  const data = await res.json;
  return data.items[0];
}

function getTierName(tier) {
  const tiers = [
    "", "Bronze V", "Bronze IV", "Bronze III", "Bronze II", "Bronze I",
    "Silver V", "Silver IV", "Silver III", "Silver II", "Silver I",
    "Gold V", "Gold IV", "Gold III", "Gold II", "Gold I",
    "Platinum V", "Platinum IV", "Platinum III", "Platinum II", "Platinum I",
    "Diamond V", "Diamond IV", "Diamond III", "Diamond II", "Diamond I",
    "Ruby V", "Ruby IV", "Ruby III", "Ruby II", "Ruby I"
  ];
  return tiers[tier] || "Unrated";
}

function generateBadge(data) {
  const tierName = getTierName(data.tier);
  const solved = data.solvedCount;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="240" height="20">
  <linearGradient id="a" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <rect rx="3" width="240" height="20" fill="#555"/>
  <rect rx="3" x="80" width="160" height="20" fill="#007ec6"/>
  <path fill="#007ec6" d="M80 0h4v20h-4z"/>
  <rect rx="3" width="240" height="20" fill="url(#a)"/>
  <g fill="#fff" text-anchor="middle"
     font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="40" y="14">solved.ac</text>
    <text x="160" y="14">${tierName} (${solved} solved)</text>
  </g>
</svg>
  `.trim();

  fs.writeFileSync(outputPath, svg, 'utf8');
}

async function main() {
  const profile = await fetchProfile();
  fs.writeFileSync('./data/profile.json', JSON.stringify(profile, null, 2));
  generateBadge(profile);
}

main();
