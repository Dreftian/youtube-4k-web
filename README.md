<div align="center">

  <h1>YouTube 4K · Sitio de distribución</h1>

  <p><strong>Sitio oficial de descarga de YouTube 4K.</strong><br>
  Estático y sin build: la versión y los archivos se leen en vivo de la API de GitHub Releases.</p>

  <p>
    <a href="https://dreftian.github.io/youtube-4k-web/"><img src="https://img.shields.io/badge/live-youtube%204K-22c55e?style=flat-square&amp;labelColor=0a0a12" alt="Sitio en vivo"></a>
    <a href="https://github.com/Dreftian/youtube-4k-web/actions/workflows/pages.yml"><img src="https://github.com/Dreftian/youtube-4k-web/actions/workflows/pages.yml/badge.svg" alt="Estado de deploy"></a>
    <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&amp;logo=react&amp;logoColor=black" alt="React">
    <img src="https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&amp;logo=tailwindcss&amp;logoColor=white" alt="Tailwind">
    <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&amp;logo=vite&amp;logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/3%20plataformas-111827?style=flat-square&amp;labelColor=0a0a12" alt="Windows, Linux, macOS">
  </p>

  <p>
    <a href="#qué-es">Qué es</a> ·
    <a href="#cómo-funciona">Cómo funciona</a> ·
    <a href="#especificaciones">Especificaciones</a> ·
    <a href="#despliegue">Despliegue</a>
  </p>

</div>

---

## Qué es

La página de descarga del **descargador de escritorio YouTube 4K**: 4K/8K, HDR, audio de alta
fidelidad y subtítulos exportables, con descarga multi-conexión. Se ejecuta en tu máquina:
sin cuentas, sin anuncios y sin límite artificial de velocidad.

Este repositorio **no contiene el código de la aplicación**, solo el sitio. El binario se
publica como release en [`Dreftian/youtube-4k-releases`](https://github.com/Dreftian/youtube-4k-releases)
y el código fuente se mantiene en el repositorio privado
[`Dreftian/youtube-4k`](https://github.com/Dreftian/youtube-4k).

| | |
| --- | --- |
| **Sitio** | <https://dreftian.github.io/youtube-4k-web/> |
| **Descargas** | <https://dreftian.github.io/youtube-4k-web/#descargas> |
| **Instaladores** | [`youtube-4k-releases`](https://github.com/Dreftian/youtube-4k-releases/releases/latest) |
| **Plataformas** | Windows 10/11 x64 · Debian/Fedora/AppImage · macOS |

## Cómo funciona

El sitio no tiene backend. Todo ocurre en el navegador, en tres pasos:

1. **Consulta la release.** Al cargar, pide
   `https://api.github.com/repos/Dreftian/youtube-4k-releases/releases/latest`.
2. **Elige el instalador.** Mapea la plataforma del visitante a la extensión correcta
   (`.exe` / `.msi`, `.deb` / `.rpm` / `.AppImage`, `.dmg`) y muestra la versión publicada.
3. **Enlaza al asset.** El botón apunta directamente al archivo de la release. Sin
   intermediarios, sin enlaces rotos por una versión desactualizada.

El build se publica con rutas absolutas bajo `/youtube-4k-web/`, por lo que el sitio funciona
alojado en GitHub Pages sin configuración extra.

## Especificaciones

Ficha técnica del descargador, sin adjetivos:

| | |
| --- | --- |
| **Resolución máxima** | 4320p · 8K UHD |
| **HDR** | HDR10 · HDR10+ · Dolby Vision |
| **Vídeo** | VP9 · AV1 · H.264 |
| **Audio** | Opus 256k · AAC · FLAC 24-bit |
| **Subtítulos** | `.srt` · `.vtt` · `.txt` · `.json` |
| **Acelerador** | `aria2c` multi-conexión |
| **Extractor** | `yt-dlp` |
| **Post-proceso** | `ffmpeg` / `ffprobe` |
| **Concurrencia** | cola con límite ajustable |
| **Progreso** | eventos a ≤ 10 Hz |
| **Cancelación** | < 120 ms |
| **Interfaz** | Tauri v2 · Rust + React |
| **Tamaño del instalador** | ~3 MB |

`yt-dlp` y `ffmpeg` pesan unos 180 MB, así que se descargan en el primer arranque: el instalador
se queda en tres megas y siempre va sin versionado. `aria2c` se instala con el gestor de
paquetes del sistema en Linux y macOS:

```bash
sudo apt install aria2     # Debian / Ubuntu / Fedora
brew install aria2         # macOS
```

## Estructura

```
.
├── index.html              # shell del build (React + Tailwind + Vite)
├── assets/                 # bundle JS y CSS con hash
├── favicon.svg             # icono del sitio
├── og.svg                  # imagen de Open Graph / Twitter Card
├── robots.txt
├── sitemap.xml
└── .github/workflows/      # deploy automático a GitHub Pages
```

## Despliegue

Cada `push` a `main` dispara [`pages.yml`](.github/workflows/pages.yml). El workflow **no
compila nada**: el repositorio ya contiene el build, así que se limita a preparar `_site` con
`index.html`, `favicon.svg`, `og.svg`, `robots.txt`, `sitemap.xml` y `assets/`, y a subirlo
como artefacto de GitHub Pages.

Para publicar una versión nueva basta con subir el bundle generado y actualizar las referencias
con hash en `index.html`:

```bash
npm run build          # genera dist/
```

## Enlaces

- **Sitio** → <https://dreftian.github.io/youtube-4k-web/>
- **Releases** → <https://github.com/Dreftian/youtube-4k-releases/releases>
- **Perfil** → <https://github.com/Dreftian>

---

<div align="center">
  <sub>Diseñado y construido por <a href="https://github.com/Dreftian">Dreftian</a></sub>
</div>
