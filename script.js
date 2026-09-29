/* --------------------------------------------------------------------------
   YouTube 4K — release lookup
   Lee la última release del canal público y pinta las descargas. Sin claves.
   -------------------------------------------------------------------------- */

const REPO = "Dreftian/youtube-4k-releases";
const API = `https://api.github.com/repos/${REPO}/releases/latest`;

const OS = [
  {
    id: "windows",
    label: "Windows",
    tag: "Windows 10 / 11",
    icon: `<svg viewBox="0 0 24 24"><path d="M3 5.5l7.5-1v7H3zM12.5 4.3L21 3v8.5h-8.5zM3 13.5h7.5v7L3 19.5zM12.5 13.5H21V22l-8.5-1.3z"/></svg>`,
    ext: [".exe", ".msi"],
    // El .exe es lo que usa la gente; el .msi es para despliegues.
    primary: ".exe",
    note: "El instalador .exe es el más cómodo. Los .msi son para despliegues.",
  },
  {
    id: "linux",
    label: "Linux",
    tag: "Debian · Fedora · AppImage",
    icon: `<svg viewBox="0 0 24 24"><path d="M12 3c-2 0-2.6 1.4-2.6 3 0 1.2-.3 1.8-.9 2.8C7 10.6 5 12.6 5 15a5 5 0 0010 0c0-2.4-2-4.4-3.5-6.2-.6-.7-.8-1.4-.8-2.3 0-1.9-.6-3.5-2.7-3.5z"/><path d="M10 8.2a.9.9 0 100 .1M14 8.2a.9.9 0 100 .1"/></svg>`,
    // Ojo: `.appimage` en minúsculas. El nombre real trae mayúscula y un
    // `endsWith` sensible a mayúsculas se lo tragaría como otra cosa.
    ext: [".appimage", ".deb", ".rpm"],
    primary: ".appimage",
    note: "AppImage no necesita instalar nada: dale permiso de ejecución y ábrelo.",
  },
  {
    id: "macos",
    label: "macOS",
    tag: "10.15 o superior",
    icon: `<svg viewBox="0 0 24 24"><path d="M16.5 12.7c0-2 1.6-3 1.7-3.1-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.3 2-1.4 2.4-.4 6 1 8 .7 1 1.5 2.1 2.5 2 1 0 1.4-.6 2.6-.6s1.5.6 2.6.6 1.8-1 2.4-2c.8-1.1 1.1-2.2 1.1-2.3 0 0-2.1-.8-2.1-3zM14.6 6.4c.5-.6.9-1.5.8-2.4-.8 0-1.7.5-2.3 1.1-.5.6-.9 1.5-.8 2.3.9.1 1.8-.4 2.3-1z"/></svg>`,
    ext: [".dmg", ".tar.gz"],
    // El .app va comprimido como .tar.gz, que también acaba en .gz.
    primary: ".dmg",
    note: "El .dmg es el instalador; el .tar.gz es la app para Apple Silicon.",
  },
];

const fmtSize = (bytes) => {
  if (!bytes) return "";
  const mb = bytes / 1024 / 1024;
  if (mb >= 100) return `${Math.round(mb)} MB`;
  if (mb >= 10) return `${mb.toFixed(0)} MB`;
  return `${mb.toFixed(1)} MB`;
};

const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};

/** Escapa texto que viene de GitHub antes de meterlo en innerHTML. */
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );

function group(assets) {
  const out = {};
  for (const os of OS) {
    out[os.id] = assets.filter((a) => os.ext.some((e) => a.name.toLowerCase().endsWith(e)));
  }
  return out;
}

function renderCard(os, assets, version) {
  const card = el("div", "card");

  const top = el("div", "card-top");
  top.appendChild(el("span", "os-ico", os.icon));
  const meta = el("div");
  meta.appendChild(el("div", "card-os", esc(os.label)));
  meta.appendChild(el("div", "card-tag", esc(os.tag)));
  top.appendChild(meta);
  card.appendChild(top);

  // El asset principal primero: es el que la gente quiere.
  const sorted = [...assets].sort((a, b) => {
    const pa = a.name.toLowerCase().endsWith(os.primary) ? 0 : 1;
    const pb = b.name.toLowerCase().endsWith(os.primary) ? 0 : 1;
    if (pa !== pb) return pa - pb;
    return a.size - b.size;
  });

  const list = el("div", "dl");
  for (const a of sorted) {
    const row = el(
      "a",
      "dl-row",
      `<span class="dl-ext">${esc(a.name.split(".").pop().toLowerCase())}</span>` +
        `<span class="dl-size">${fmtSize(a.size)}</span>`,
    );
    row.href = a.browser_download_url;
    row.title = a.name;
    row.setAttribute("download", "");
    row.setAttribute("rel", "noopener noreferrer");
    list.appendChild(row);
  }
  card.appendChild(list);

  const note = el("p", "card-note", `${os.note} <span style="opacity:.6">· ${esc(version)}</span>`);
  card.appendChild(note);

  return card;
}

async function load() {
  const box = document.querySelector("[data-downloads]");
  const fallback = document.querySelector("[data-fallback]");
  const dateSlot = document.querySelector("[data-release-date]");

  let res;
  try {
    res = await fetch(API, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch {
    box.innerHTML = "";
    fallback.hidden = false;
    return;
  }

  const rel = await res.json();
  const version = (rel.tag_name || "").replace(/^v/, "");

  // Versión en el hero, en el pie y en los botones.
  for (const n of document.querySelectorAll("[data-ver]")) n.textContent = `v${version}`;

  if (dateSlot && rel.published_at) {
    dateSlot.textContent = `v${version} · publicada el ${fmtDate(rel.published_at)}`;
  }

  const byOs = group(rel.assets || []);
  box.innerHTML = "";

  for (const os of OS) {
    if (byOs[os.id].length === 0) continue;
    box.appendChild(renderCard(os, byOs[os.id], `v${version}`));
  }

  if (box.children.length === 0) {
    fallback.hidden = false;
  }

  // El botón principal apunta al instalador del sistema detectado. Si ese
  // sistema no trae artefacto, se cae al primero disponible en vez de dejar
  // el botón apuntando a "#descargas".
  const primary = document.querySelector("[data-primary-download]");
  if (primary) {
    const ua = navigator.userAgent.toLowerCase();
    const guess = ua.includes("win")
      ? "windows"
      : ua.includes("mac") || ua.includes("iphone") || ua.includes("ipad")
        ? "macos"
        : "linux";
    const pick = (id) => {
      const os = OS.find((o) => o.id === id);
      return os ? byOs[id]?.find((a) => a.name.toLowerCase().endsWith(os.primary)) : null;
    };
    const target = pick(guess) ?? OS.map((o) => pick(o.id)).find(Boolean);
    if (target) {
      primary.href = target.browser_download_url;
      primary.setAttribute("download", "");
    }
  }
}

load();
