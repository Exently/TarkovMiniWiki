let allQuests = [];
let currentIndex = -1;
let filteredQuests = [];
let itemData = [];

document.addEventListener("DOMContentLoaded", () => {
    fetch("./data/tarkov_items.json")
        .then(res => res.json())
        .then(data => {
            itemData = data;
            console.log("📦 Items geladen:", itemData.length);
        });

    fetch("./data/tarkov_tasks.json")
        .then(res => res.json())
        .then(data => {
            allQuests = data;
            console.log("Quests geladen:", allQuests.length);
        })
        .catch(err => console.error("Fehler beim Laden der JSON:", err));

    const inputEl = document.getElementById("wiki-input");
    const suggestionsEl = document.getElementById("suggestions");
    const clearBtn = document.getElementById("clear-btn");

    inputEl.addEventListener("input", () => {
        const inputValue = inputEl.value.trim();
        if (!inputValue) {
            suggestionsEl.style.display = "none";
            suggestionsEl.innerHTML = "";
            currentIndex = -1;
            filteredQuests = [];
            return;
        }

        const lowerVal = inputValue.toLowerCase();
        filteredQuests = allQuests.filter(q =>
            q.name.toLowerCase().includes(lowerVal)
        );

        if (filteredQuests.length === 0) {
            suggestionsEl.style.display = "none";
            suggestionsEl.innerHTML = "";
            const fallback = "https://escapefromtarkov.fandom.com/wiki/" + inputValue.replace(/\s+/g, "_");
            currentIndex = -1;
        } else {
            suggestionsEl.style.display = "block";
            suggestionsEl.innerHTML = filteredQuests
                .map((q, i) => `<div data-index="${i}">${q.name}</div>`)
                .join("");
            currentIndex = 0;
            highlightSuggestion()
        }
    });

    suggestionsEl.addEventListener("click", (event) => {
        if (event.target.tagName === "DIV") {
            const i = parseInt(event.target.getAttribute("data-index"), 10);
            selectQuest(i);
        }
    });

    clearBtn.addEventListener("click", () => {
        // Eingabe leeren
        inputEl.value = "";

        // Vorschläge ausblenden
        suggestionsEl.style.display = "none";
        suggestionsEl.innerHTML = "";
        currentIndex = -1;
        filteredQuests = [];
    });

    inputEl.addEventListener("keydown", (e) => {
        if (filteredQuests.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            currentIndex++;
            if (currentIndex >= filteredQuests.length) {
                currentIndex = 0;
            }
            highlightSuggestion();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = filteredQuests.length - 1;
            }
            highlightSuggestion();
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (currentIndex >= 0 && currentIndex < filteredQuests.length) {
                selectQuest(currentIndex);
            }
        }
    });
});

function highlightSuggestion() {
    const suggestionsEl = document.getElementById("suggestions");

    Array.from(suggestionsEl.querySelectorAll("div")).forEach(div => {
        div.classList.remove("selected");
    });

    if (currentIndex >= 0 && currentIndex < filteredQuests.length) {
        const items = suggestionsEl.querySelectorAll("div");
        const selectedDiv = items[currentIndex];
        selectedDiv.classList.add("selected");

        selectedDiv.scrollIntoView({
            block: "nearest",
            inline: "nearest",
            behavior: "smooth"
        });
    }
}

function selectQuest(i) {
    const inputEl = document.getElementById("wiki-input");
    const suggestionsEl = document.getElementById("suggestions");

    const quest = filteredQuests[i];
    inputEl.value = quest.name;

    suggestionsEl.innerHTML = "";
    suggestionsEl.style.display = "none";
    currentIndex = -1;
    filteredQuests = [];

    showQuestDetails(quest);
}

function showQuestDetails(quest) {
    const traderImgEl = document.getElementById("trader-img");
    const kappaEl = document.getElementById("kappa-indicator");
    const lightkeeperEl = document.getElementById("lightkeeper-indicator");
    const titleEl = document.getElementById("quest-title");
    const objEl = document.getElementById("quest-objective");
    const rewEl = document.getElementById("quest-reward");
    const mapEl = document.getElementById("quest-map");
    const imgEl = document.getElementById("quest-image");
  
    // Trader-Bild
    traderImgEl.src = getTraderImage(quest.trader?.name || "Unknown");
  
    // Kappa
    if (quest.kappaRequired) {
      kappaEl.textContent = "YES";
      kappaEl.classList.remove("kappa-no");
      kappaEl.classList.add("kappa-yes");
    } else {
      kappaEl.textContent = "NO";
      kappaEl.classList.remove("kappa-yes");
      kappaEl.classList.add("kappa-no");
    }
  
    // Lightkeeper
    if (lightkeeperEl) {
      if (quest.lightkeeperRequired) {
        lightkeeperEl.textContent = "YES";
        lightkeeperEl.classList.remove("lk-no");
        lightkeeperEl.classList.add("lk-yes");
      } else {
        lightkeeperEl.textContent = "NO";
        lightkeeperEl.classList.remove("lk-yes");
        lightkeeperEl.classList.add("lk-no");
      }
    }
  
    // Titel
    titleEl.innerHTML = `
      <a href="${quest.wikiLink}" target="_blank">${quest.name}</a>
    `;
  
    // Map
    if (mapEl && quest.map?.name) {
      mapEl.textContent = `Map: ${quest.map.name}`;
    }
  
    // Bild
    if (imgEl && quest.taskImageLink) {
      imgEl.src = quest.taskImageLink;
      imgEl.alt = quest.name;
      imgEl.style.display = "block";
    }
  
    // Objectives
    objEl.innerHTML = quest.objectives
      .map(obj => {
        let text = `• ${obj.description}`;
        if (obj.count && obj.items?.length) {
          const items = obj.items.map(i => {
            const item = getItemInfo(i.name);
            if (!item) return i.name;
  
            return `
              <span class="item-tooltip-wrapper">
                <a href="${item.wikiLink}" target="_blank">${item.name}</a>
                <span class="item-tooltip">
                  <img src="${item.iconLink}" alt="${item.name}" />
                  <div>${item.name}</div>
                </span>
              </span>
            `;
          }).join(", ");
          text += ` (${obj.count}x ${items})`;
        }
        return text;
      })
      .join("<br>");
  
    // Rewards
    rewEl.innerHTML = quest.finishRewards?.items?.map(r => {
      const item = getItemInfo(r.item.name);
      if (!item) return `${r.count}x ${r.item.name}`;
  
      return `
        ${r.count}x 
        <span class="item-tooltip-wrapper">
          <a href="${item.wikiLink}" target="_blank">${item.name}</a>
          <span class="item-tooltip">
            <img src="${item.iconLink}" alt="${item.name}" />
            <div>${item.name}</div>
          </span>
        </span>
      `;
    }).join("<br>") || "–";
  }

function getItemWikiLink(itemName) {
    const match = itemData.find(i => i.name === itemName);
    return match?.wikiLink || null;
}

function getItemInfo(itemName) {
    return itemData.find(i => i.name === itemName) || null;
}

function getTraderImage(traderName) {
    if (traderName === "BTRDriver") {
        return "./assets/Pictures/BTR_Driver_Portrait.webp";
    }
    return `./assets/Pictures/${traderName}_Portrait.webp`;
}


