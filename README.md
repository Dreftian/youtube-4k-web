# YouTube 4K — sitio

Sitio de distribución de [YouTube 4K](https://github.com/Dreftian/youtube-4k-releases).
Estático, sin framework, sin build: son cuatro ficheros y ya.

## Qué hay aquí

| Fichero | Para qué |
|---|---|
| `index.html` | La página entera. Una sola columna, se lee de arriba abajo. |
| `styles.css` | Todo el diseño. Tokens CSS arriba, sin dependencias. |
| `script.js` | Lee la última release de la API de GitHub y pinta las descargas. |
| `favicon.svg` | El icono. |
| `vercel.json` | Cabeceras de caché y seguridad. |

## La versión no está escrita en ningún sitio

`script.js` pregunta a la API pública de GitHub:

```
https://api.github.com/repos/Dreftian/youtube-4k-releases/releases/latest
```

De ahí sale el número de versión (hero, pie, tarjetas) y los enlaces de
descarga, incluido el botón principal, que apunta al instalador del sistema
que esté detectando el navegador. Sube una release nueva y la web se actualiza
sola, sin tocar código.

Si la API falla, se muestra un enlace directo a la página de releases en lugar
de romperse.

## Desarrollo

No hay build. Sirve la carpeta y listo:

```bash
npx serve .
# o
python -m http.server 8080
```

## Despliegue

Vercel, con la raíz en esta carpeta. No hace falta configuración de build.

## Creado por Dreftian.
