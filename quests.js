let allQuests = [];
let currentIndex = -1; 
let filteredQuests = [];

/**
 * Liest das JSON, bereitet Event-Handler für Autocomplete und Tasten vor.
 */
document.addEventListener("DOMContentLoaded", () => {
  // 1) JSON laden
  fetch("all_quests.json")
    .then(res => res.json())
    .then(data => {
      allQuests = data;
      console.log("Quests geladen:", allQuests.length);
    })
    .catch(err => console.error("Fehler beim Laden der JSON:", err));

  // 2) Wichtige DOM-Elemente
  const inputEl = document.getElementById("wiki-input");
  const suggestionsEl = document.getElementById("suggestions");
  const linkEl = document.getElementById("wiki-link");

  // 3) Beim Tippen in das Textfeld
  inputEl.addEventListener("input", () => {
    const inputValue = inputEl.value.trim();
    if (!inputValue) {
      // Nichts eingetippt => alles zurücksetzen
      suggestionsEl.style.display = "none";
      suggestionsEl.innerHTML = "";
      linkEl.href = "";
      linkEl.textContent = "Bitte Text eingeben";
      currentIndex = -1;
      filteredQuests = [];
      return;
    }

    // Teilstring-Suche (case-insensitive)
    const lowerVal = inputValue.toLowerCase();
    filteredQuests = allQuests.filter(q =>
      q.Questname.toLowerCase().includes(lowerVal)
    );

    if (filteredQuests.length === 0) {
      // Kein Treffer
      suggestionsEl.style.display = "none";
      suggestionsEl.innerHTML = "";
      const fallback = "https://escapefromtarkov.fandom.com/wiki/" + inputValue.replace(/\s+/g, "_");
      linkEl.href = fallback;
      linkEl.textContent = "RIP"; // Beliebiger Text, falls kein Treffer
      currentIndex = -1;
    } else {
      // Treffer-Liste anzeigen
      suggestionsEl.style.display = "block";
      suggestionsEl.innerHTML = filteredQuests
        .map((q, i) => `<div data-index="${i}">${q.Questname}</div>`)
        .join("");

      currentIndex = 0;
      linkEl.href = filteredQuests[0].WikiLink;
      linkEl.textContent = filteredQuests[0].Questname;
    }
  });

  // Klick auf Vorschlagsliste
  suggestionsEl.addEventListener("click", (event) => {
    if (event.target.tagName === "DIV") {
      const i = parseInt(event.target.getAttribute("data-index"), 10);
      selectQuest(i);
    }
  });

  // Pfeiltasten + Enter
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

/**
 * Hebt den aktuellen Vorschlag hervor und aktualisiert den Link.
 */
function highlightSuggestion() {
  const suggestionsEl = document.getElementById("suggestions");
  const linkEl = document.getElementById("wiki-link");

  Array.from(suggestionsEl.querySelectorAll("div")).forEach(div => {
    div.classList.remove("selected");
  });

  if (currentIndex >= 0 && currentIndex < filteredQuests.length) {
    const items = suggestionsEl.querySelectorAll("div");
    const selectedDiv = items[currentIndex];
    selectedDiv.classList.add("selected");

    linkEl.href = filteredQuests[currentIndex].WikiLink;
    linkEl.textContent = filteredQuests[currentIndex].Questname;

    // In den sichtbaren Bereich scrollen
    selectedDiv.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "smooth"
    });
  }
}

/**
 * Wählt einen Questvorschlag aus, setzt das Textfeld, schließt die Liste, 
 * und zeigt die Quest-Details rechts an.
 */
function selectQuest(i) {
  const inputEl = document.getElementById("wiki-input");
  const suggestionsEl = document.getElementById("suggestions");
  const linkEl = document.getElementById("wiki-link");

  const quest = filteredQuests[i];
  inputEl.value = quest.Questname;
  linkEl.href = quest.WikiLink;
  linkEl.textContent = quest.Questname;

  // Liste ausblenden
  suggestionsEl.innerHTML = "";
  suggestionsEl.style.display = "none";
  currentIndex = -1;
  filteredQuests = [];

  showQuestDetails(quest);
}

/**
 * Zeigt die Questdetails in der rechten Spalte. 
 * Objective & Reward werden direkt mit Links versehen (per transformToLinks).
 */
function showQuestDetails(quest) {
  const traderImgEl  = document.getElementById("trader-img");
  const kappaEl      = document.getElementById("kappa-indicator");
  const titleEl      = document.getElementById("quest-title");
  const objEl        = document.getElementById("quest-objective");
  const rewEl        = document.getElementById("quest-reward");
  const linksEl      = document.getElementById("quest-links");

  // Trader-Bild ermitteln
  traderImgEl.src = getTraderImage(quest.Questgeber);

  // Kappa
  if (quest["Required for Kappa"] === "Yes") {
    kappaEl.textContent = "YES";
    kappaEl.classList.remove("kappa-no");
    kappaEl.classList.add("kappa-yes");
  } else {
    kappaEl.textContent = "NO";
    kappaEl.classList.remove("kappa-yes");
    kappaEl.classList.add("kappa-no");
  }

  // Überschrift
  titleEl.innerHTML = `
  <a href="${quest.WikiLink}" target="_blank" style="color: inherit; text-decoration: none;">
    ${quest.Questname}
  </a>
`;

  const rawObj = quest.Objective || "";
  const rawRew = quest.Reward || "";
  objEl.innerHTML = transformToLinks(rawObj, quest.AdditionalLinks);
  rewEl.innerHTML = transformToLinks(rawRew, quest.AdditionalLinks);
  linksEl.innerHTML = "";
}

function transformToLinks(originalText, linkObjs) {
  if (!linkObjs || linkObjs.length === 0) {
    return originalText;
  }

  let text = originalText;

  linkObjs.forEach(({ text: linkText, url }) => {
    const safeSearch = linkText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`\\b${safeSearch}\\b`, 'g');

    // Ersetzen
    const linkHTML = `<a href="${url}" target="_blank">${linkText}</a>`;
    text = text.replace(pattern, linkHTML);
  });

  return text;
}

function getTraderImage(traderName) {
  if (traderName === "BTRDriver") {
    return "./Pictures/BTR_Driver_Portrait.webp";
  }
  return `./Pictures/${traderName}_Portrait.webp`;
}
