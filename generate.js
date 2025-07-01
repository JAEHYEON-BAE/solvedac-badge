import fs from 'fs';
import fetch from 'node-fetch';

const handle = 'jaehyeon3357';
const outputPath = 'badges/solvedac.svg';

async function fetchProfile() {
  const res = await fetch(`https://solved.ac/api/v3/search/user?query=${handle}`);
  const data = await res.json();
  console.log("Fetched data:", data); // DEBUG
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

function getPercentage(rating) {
  const ratings = [
    0, 
    30, 60, 90, 120, 150,
    200, 300, 400, 500, 650,
    800, 950, 1100, 1250, 1400,
    1600, 1750, 1900, 2000, 2100,
    2200, 2300, 2400, 2500, 2600,
    2700, 2800, 2850, 2900, 2950,
    3000
  ];
  for (let i = 0; i < ratings.length; i++) {
    if (rating < ratings[i]) {
      const lower = ratings[i-1];
      const upper = ratings[i];
      return (rating-lower)*100/(upper-lower);
    }
  }
  return 100;
}
  

function generateBadge(data) {
  const tierName = getTierName(data.tier);
  const solved = data.solvedCount;
  const rating = data.rating;
  const percent = getPercentage(rating);

  const svg = `
<svg width="600" height="120" xmlns="http://www.w3.org/2000/svg">
  <linearGradient id="a" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0" stop-color="#27e2a4"/>
    <stop offset="1" stop-color="#00b4fc"/>
  </linearGradient>
  <style>
    .text {
      fill: #000;
    }
    .bar-bg {
      fill: #000000;
    }
    
    @media (prefers-color-scheme: dark) {
      .text {
        fill: #fff;
      }
      .bar-bg {
        fill: #fff;
      }
    }
  </style>

  <g font-family="Noto Sans,Verdana,Geneva,sans-serif" font-size="20" font-weight="bold">
    <text id="rating" x="5%" y="50%" class="text" text-anchor="middle">${rating}
      <animate
        attributeName="x"
        from="5%"
        to="${percent*0.9 + 5}%"
        dur="1s"
        fill="freeze"
        calcMode="spline" 
        keyTimes="0;1" 
        keySplines="0 0 0.58 1.0"
        />
    </text>
    
    <text x="0" y="100%" class="text" text-anchor="start">${tierName}</text>
    <text x="100%" y="100%" class="text" text-anchor="end">${solved} solved</text>

  </g>

  <rect x="5%" y="67" width="90%" height="30" class="bar-bg"/>
  <rect x="5%" y="67" width="90%" height="30" fill="url(#a)">
    <animate 
      attributeName="width" 
      from="0" 
      to="${percent * 0.9}%" 
      dur="1.5s" 
      fill="freeze" 
      calcMode="spline" 
      keyTimes="0;1" 
      keySplines="0 0 0.58 1.0"
    />
  </rect>
</svg>
  `.trim();

  fs.writeFileSync(outputPath, svg, 'utf8');
}

async function main() {
  try {
    const profile = await fetchProfile();
    fs.writeFileSync('./data/profile.json', JSON.stringify(profile, null, 2));
    generateBadge(profile);
  } catch (err) {
    console.error("❌ Failed to fetch or process solved.ac data:", err.message);
    process.exit(1);  // 실패를 로그로 남기고 종료
  }
}

main();
