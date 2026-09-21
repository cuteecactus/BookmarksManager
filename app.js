let bookmarks = [];

const addForm = document.getElementById("addForm");
const nameInput = document.getElementById("nameInput");
const urlInput = document.getElementById("urlInput");
const iconInput = document.getElementById("iconInput");
const bookmarksDiv = document.getElementById("bookmarks");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");

async function loadBookmarks() {
  const res = await fetch("/api/bookmarks");
  const data = await res.json();
  bookmarks = data.bookmarks || [];
  render();
}

async function saveBookmarks() {
  await fetch("/api/bookmarks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookmarks }),
  });
}

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const url = urlInput.value.trim();
  const icon = iconInput.value.trim();
  if (!name || !url) return;

  bookmarks.push({
    id: crypto.randomUUID(),
    name,
    url,
    icon: icon || "",
    created: new Date().toISOString(),
  });

  nameInput.value = "";
  urlInput.value = "";
  iconInput.value = "";

  await saveBookmarks();
  render();
});

function getFilteredBookmarks() {
  const q = searchInput.value.toLowerCase();
  if (!q) return bookmarks;
  return bookmarks.filter(
    (b) => b.name.toLowerCase().includes(q) || b.url.toLowerCase().includes(q)
  );
}

function render() {
  bookmarksDiv.innerHTML = "";

  const filtered = getFilteredBookmarks();

  if (filtered.length === 0) {
    emptyState.textContent = bookmarks.length === 0
      ? "No bookmarks yet. Add one above!"
      : "No matches found.";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  filtered.forEach((b) => {
    const el = document.createElement("div");
    el.className = "bookmark";

    el.innerHTML = `
      <div class="bookmark-icon">${b.icon ? `<img src="${escapeHtml(b.icon)}" alt="">` : "🔗"}</div>
      <div class="bookmark-info">
        <div class="bookmark-name">${escapeHtml(b.name)}</div>
        <div class="bookmark-url">${escapeHtml(b.url)}</div>
      </div>
      <div class="bookmark-actions">
        <button class="danger" data-action="delete" title="Remove">Remove</button>
      </div>
    `;

    el.addEventListener("click", (e) => {
      if (e.target.closest('[data-action="delete"]')) return;
      window.open(b.url, "_blank", "noopener");
    });

    el.querySelector('[data-action="delete"]').addEventListener("click", async (e) => {
      e.stopPropagation();
      bookmarks = bookmarks.filter((bm) => bm.id !== b.id);
      await saveBookmarks();
      render();
    });

    bookmarksDiv.appendChild(el);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

searchInput.addEventListener("input", render);

loadBookmarks();
