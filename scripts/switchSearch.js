function toggleSearch() {
    const toggle = document.getElementById("searchToggle");
    const headerLabel = document.getElementById("Search-Header");
    const inputPlaceholder = document.getElementById("wiki-input");

    if (toggle.checked) {
        headerLabel.textContent = "Item-Search";
        inputPlaceholder.placeholder = "Search for items...";
    } else {
        headerLabel.textContent = "Quest-Search";
        inputPlaceholder.placeholder = "Search for quests...";
    }
}
