function toggleSearch() {
    const toggle = document.getElementById("searchToggle");
    const headerLabel = document.getElementById("Search-Header");
    const input = document.getElementById("wiki-input");
    const warning = document.getElementById("WARNING");

    if (toggle.checked) {
        headerLabel.textContent = "Item-Search";
        input.placeholder = "Search for items...";
        input.hidden = true;
        warning.hidden = false
        warning.textContent = "⚠️ Item search is not available yet! Please use the quest search for now.";
    } else {
        headerLabel.textContent = "Quest-Search";
        input.placeholder = "Search for quests...";
        input.hidden = false;
        warning.hidden = true
    }
}
