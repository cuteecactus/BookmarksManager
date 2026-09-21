# Bookmark Manager

A simple bookmark manager with card view, built with vanilla HTML, CSS, and Node.js.

## Features

- Add, remove, and search bookmarks
- Optional icon URL per bookmark
- Card grid layout with click-to-open in new tab
- Search filters by name or URL
- Data persisted in a local JSON file

## Quick Start

```bash
node server.js
```

Open http://localhost:3000 in your browser.

## Recommended Workflow

### 1. Add as Startup App (Windows)

1. Press `Win + R`, type `shell:startup`, press Enter
2. Create a shortcut to `start.bat` in the opened folder
3. The server will now start automatically on login

### 2. Pin in Browser

1. Start the server and open http://localhost:3000
2. Pin the tab to your browser's tab bar:
   - **Chrome/Edge**: Right-click the tab > Pin
   - **Firefox**: Right-click the tab > Pin Tab
3. The bookmark manager is now always one click away

## Configuration

Edit `config.json` to change settings:

```json
{
  "port": 3000,
  "dataFile": "bookmarks.json"
}
```

- `port` — server port (default: 3000)
- `dataFile` — path to the bookmarks data file (default: bookmarks.json, relative to project root)

## Project Structure

```
.
├── index.html        # UI
├── styles.css        # Dark theme card layout
├── app.js            # Client-side logic
├── server.js         # Node.js server + API
├── config.json       # Server configuration
├── bookmarks.json    # Bookmark data (auto-created)
└── README.md
```

## API

| Method | Endpoint          | Description            |
|--------|-------------------|------------------------|
| GET    | /api/bookmarks    | Get all bookmarks      |
| POST   | /api/bookmarks    | Replace all bookmarks  |

## Requirements

- [Node.js](https://nodejs.org/)
