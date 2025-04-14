const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const query = `
{
  tasks(lang: en) {
    id
    name
    normalizedName
    wikiLink
    trader { name, imageLink, image4xLink }
    map { name }
    experience
    kappaRequired
    lightkeeperRequired
    taskRequirements {
      task { id name }
      status
    }
    startRewards {
      items { item { name } count }
    }
    finishRewards {
      items { item { name } count }
    }
    objectives {
      description
      ... on TaskObjectiveItem {
        items { id name }
        count
      }
      ... on TaskObjectivePlayerLevel {
        playerLevel
      }
    }
  }
}
`;

async function fetchAndSave() {
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
  const outputPath = path.join(outputDir, "tarkov_tasks.json");

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  fs.writeFileSync(outputPath, JSON.stringify(json.data.tasks, null, 2));
  console.log("✅ File updated:", outputPath);
}

fetchAndSave().catch(console.error);
