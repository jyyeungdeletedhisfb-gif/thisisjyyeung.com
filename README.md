# thisisjyyeung.com

Static artist site for **Jy Yeüng**. Alpha ships the **Dysphoria** era page (intro → sheet player → soundtrack).

Remote (intended): https://github.com/jyyeungdeletedhisfb-gif/thisisjyyeung.com

## Preview locally

No build step. From this folder:

```bash
# Python 3
python3 -m http.server 8080

# or Node
npx --yes serve -l 8080
```

Open http://localhost:8080/ then **Enter Dysphoria**, or go straight to http://localhost:8080/dysphoria/

Paths are root-absolute (`/css/...`, `/assets/...`), so serve from the project root — not from a subfolder.

## Project layout

```
index.html                 # hub (links into Dysphoria)
dysphoria/index.html       # era page shell
content/dysphoria.json     # editable titles, liners, image paths, playlist
assets/dysphoria/          # cover + 15 plates (+ optional alts)
css/dysphoria.css
js/dysphoria.js            # loads content JSON, drives scrub + player
```

## Edit content (no code)

Open `content/dysphoria.json`:

| Field | What it does |
| --- | --- |
| `meta.*` | Document title, description, OG image hooks |
| `chrome.*` | Top-left brand link + centered era title |
| `intro.*` | Cover image, heading, body copy, scroll hint |
| `soundtrack.*` | Apple Music URL + embed |
| `tracks[]` | Ordered list of 15 sheets |

Per track:

- `title` / optional `titleDisplay` (e.g. spaced `t r a n c e`)
- `liner` — flip-side text
- `src` — primary plate path
- `alt` — optional alternate plate (enables Replace control)
- `ar` — aspect ratio width/height (used to size the plate)

Track order follows the Chimera playlist lock:

1. The Host  
2. Grinding Grit onto Grief *(bent figure)*  
3. A Charlatan’s Curse *(umbrella / briefcase)*  
4–15. Funnel → … → The Divided Line  

Soft masters for Host + Charlatan are intentional for this alpha.

## Swap / add images

1. Drop files into `assets/dysphoria/` (JPG/PNG/WebP).
2. Update the matching `src` / `alt` / `intro.cover` paths in `content/dysphoria.json`.
3. Refresh the browser (hard refresh if cached).

No rebuild required.

## Deploy

### GitHub Pages

1. Push this repo to `main` on GitHub.
2. Repo → **Settings → Pages** → Source: **Deploy from a branch** → `main` / `/ (root)`.
3. Optional: connect custom domain `thisisjyyeung.com` (add a `CNAME` file with that hostname if you want it in-repo).
4. A `.nojekyll` file is included so GitHub does not process the static tree.

### Vercel (later)

Import the repo, framework preset **Other**, output = repo root. Custom domain works the same.

## Controls (Dysphoria player)

- Scroll on intro: scrub cover into dark sheets  
- ← / → keys, side peeks, or drag plate: change track  
- Flip: liner note  
- Loupe: magnifier on plate  
- Replace: swap primary ↔ alt when an `alt` image exists  
- Title bar hover: jump list  
- Floating ↑: back to top  

## Notes

- No e-commerce in this alpha.  
- Do not invent biography beyond the era copy already in `content/dysphoria.json`.  
- Spotify link is marked “soon” until a public mirror exists.
