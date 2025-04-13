const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const query = `
{
  items {
    id
    name
    shortName
    normalizedName
    description
    basePrice
    avg24hPrice
    lastLowPrice
    wikiLink
    iconLink
    types
    gridImageLink
    craftsFor {
      id
      ... on Craft {
        station {
          name
        }
        requiredItems {
          item {
            name
          }
          count
        }
      }
    }
  }
}
`;

async function fetchItems() {
  const res = await fetch("https://api.tarkov.dev/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  const outputDir = path.join("data");
  const outputPath = path.join(outputDir, "tarkov_items.json");

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(json.data.items, null, 2));

  console.log("✅ Items saved to", outputPath);
}

fetchItems().catch(console.error);
