const components = {
    "header.html": "header-container",
    "notesModal.html": "notes-container",
    "mapGrid.html": "map-container",
    "questSearch.html": "quest-container"
  };
  
  Object.entries(components).forEach(([file, targetId]) => {
    fetch(`components/${file}`)
      .then(res => res.text())
      .then(html => {
        document.getElementById(targetId).innerHTML = html;
      });
  });