let allQuests = [];
let currentIndex = -1;
let filteredQuests = [];

document.addEventListener("DOMContentLoaded", () => {
    fetch("./data/all_quests.json")
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
            q.Questname.toLowerCase().includes(lowerVal)
        );

        if (filteredQuests.length === 0) {
            suggestionsEl.style.display = "none";
            suggestionsEl.innerHTML = "";
            const fallback = "https://escapefromtarkov.fandom.com/wiki/" + inputValue.replace(/\s+/g, "_");
            currentIndex = -1;
        } else {
            suggestionsEl.style.display = "block";
            suggestionsEl.innerHTML = filteredQuests
                .map((q, i) => `<div data-index="${i}">${q.Questname}</div>`)
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
    inputEl.value = quest.Questname;

    suggestionsEl.innerHTML = "";
    suggestionsEl.style.display = "none";
    currentIndex = -1;
    filteredQuests = [];

    showQuestDetails(quest);
}

function showQuestDetails(quest) {
    const traderImgEl = document.getElementById("trader-img");
    const kappaEl = document.getElementById("kappa-indicator");
    const titleEl = document.getElementById("quest-title");
    const objEl = document.getElementById("quest-objective");
    const rewEl = document.getElementById("quest-reward");

    traderImgEl.src = getTraderImage(quest.Questgeber);

    if (quest["Required for Kappa"] === "Yes") {
        kappaEl.textContent = "YES";
        kappaEl.classList.remove("kappa-no");
        kappaEl.classList.add("kappa-yes");
    } else {
        kappaEl.textContent = "NO";
        kappaEl.classList.remove("kappa-yes");
        kappaEl.classList.add("kappa-no");
    }

    titleEl.innerHTML = `
  <a href="${quest.WikiLink}" target="_blank";">
    ${quest.Questname}
  </a>
`;

    const rawObj = quest.Objective || "";
    const rawRew = quest.Reward || "";
    objEl.innerHTML = transformToLinks(rawObj, quest.AdditionalLinks);
    rewEl.innerHTML = transformToLinks(rawRew, quest.AdditionalLinks);
}

function transformToLinks(originalText, linkObjs) {
    if (!linkObjs || linkObjs.length === 0) {
        return originalText;
    }

    let text = originalText;

    linkObjs.forEach(({ text: linkText, url }) => {
        const safeSearch = linkText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`\\b${safeSearch}\\b`, 'g');

        const linkHTML = `<a href="${url}" target="_blank">${linkText}</a>`;
        text = text.replace(pattern, linkHTML);
    });

    text = text.replace(/\n/g, "<br>");
    if (text.startsWith("<br>")) {
        text = text.slice(4);
    }
    if (text.endsWith("<br>")) {
        text = text.slice(0, -4);
    }
    return text;
}

function getTraderImage(traderName) {
    if (traderName === "BTRDriver") {
        return "./assets/Pictures/BTR_Driver_Portrait.webp";
    }
    return `./assets/Pictures/${traderName}_Portrait.webp`;
}


