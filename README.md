# 🎯 EFT Mini Wiki by Exe

Willkommen zur **EFT Mini Wiki** – ein kompaktes, visuelles Wiki für das Spiel *Escape from Tarkov*.  
Diese Seite hilft dir dabei, schnell auf Karten, Quest-Infos und Notizen zuzugreifen – egal ob im Raid oder bei der Vorbereitung.

## 🔧 Features

- 🗺️ Übersichtliche Map-Sektion mit Vorschaubildern und großen Karten zum Zoomen
- 🔍 Live-Suche für Tarkov-Quests
- 📓 Eigene Notizen speichern, bearbeiten und löschen (persistiert im Browser über `localStorage`)
- 🕒 Live-Raid-Uhr
- 🛠️ Verlinkung zum WeaponBuilder (tarkovgunsmith.com)

## 🧱 Projektstruktur

```bash
.
├── index.html
├── styles/
│   └── main.css
├── scripts/
│   ├── clock.js
│   ├── notes.js
│   └── quests.js
├── components/
│   ├── header.html
│   ├── maps.html
│   └── footer.html
└── assets/
    └── Pictures/
```

## 🚀 Deployment

Diese Seite wird direkt auf **GitHub Pages** gehostet.

## 🛠️ Lokale Nutzung

Falls du lokal arbeiten willst:

1. Klone das Repository:
   ```bash
   git clone https://github.com/deinname/efwiki.git
   ```
2. Öffne den Ordner in einem Code-Editor (z. B. VS Code)
3. Starte Live Server oder öffne `index.html` direkt im Browser

## 💡 Hinweise

- Alle Daten bleiben **nur im Browser gespeichert** – deine Notizen sind lokal.
- Quests können in `quests.json` gepflegt werden.
- Das Design ist voll responsive.


## 🧠 Lizenz

Dieses Projekt ist Open Source unter der [MIT Lizenz](LICENSE).

---

> Made with ❤️ by Exe
