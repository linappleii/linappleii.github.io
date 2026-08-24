# LinApple Website Screenshots

Place emulator screenshots in this directory.

## Recommended Format
- **Format:** PNG or WebP
- **Resolution:** 560x384 (1x native) or 1120x768 (2x scale) or 1680x1152 (3x scale)

## Converting from LinApple F8 .bmp:
When you press `F8` in LinApple, it saves `linapple      1.bmp` in your current working directory. You can convert it using:

```bash
magick "linapple      1.bmp" karateka.png
```

## Adding to the Gallery in `index.html`:
Add an entry to the screenshot gallery in `index.html`:

```html
<div class="gallery-card">
  <div class="crt-viewport scanlines">
    <img src="assets/screenshots/karateka.png" alt="Karateka running in LinApple" loading="lazy">
  </div>
  <div class="gallery-card-info">
    <span class="gallery-card-title">Karateka</span>
    <span class="gallery-card-sub">Jordan Mechner (1984) • Hi-Res Color</span>
  </div>
</div>
```
