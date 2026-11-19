"""Convert raster assets used on the site to optimized WebP."""
from __future__ import annotations

import json
import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"

MAKER_PHOTOS = {
    "bambu-lab": ASSETS / "makers/new/BambuLab_photo.png",
    "bigrep": ASSETS / "makers/new/BigRep_ONE-4-scaled.jpg",
    "desktop-metal": ASSETS / "makers/new/desktop_metal_photo.jpg",
    "eufymake": ASSETS / "makers/new/eufymake_photo.webp",
    "formlabs": ASSETS / "makers/new/formlabs_photo.webp",
    "minifactory": ASSETS / "makers/new/miniFactory_photo.jpg",
    "prusa": ASSETS / "makers/new/prusa_photo.jpg",
    "raise3d": ASSETS / "makers/new/raise3d_photo.jpeg",
    "sinterit": ASSETS / "makers/new/sinterit_photo.jpeg",
    "ultimaker": ASSETS / "makers/new/ultimaker_photo.jpg",
}

SITE_RASTERS = [
    ASSETS / "drukarka-3d-bambu-lab-a1-combo.png",
    ASSETS / "hero-drukarka.jpg",
    ASSETS / "bambu-lab-ams-2-pro.png",
    ASSETS / "images/get3d-drukarki3d.png",
    ASSETS / "images/get3d-formierki3d.png",
    ASSETS / "images/get3d-filamenty.png",
    ASSETS / "images/get3d-zywice.png",
    ASSETS / "images/get3d-akcesoria.png",
    ASSETS / "images/get3d-szkolenia.png",
    ASSETS / "images/get3d-serwis.png",
    ASSETS / "images/magnific_uzyj-zaaczonego-zdjecia-drukarki-bambu-lab-a2l-combo_9ZH3B3aNYZ.jpg",
    ASSETS / "faq/zespol-1.png",
    ASSETS / "faq/zespol-2.png",
    ASSETS / "faq/zespol-3.png",
    ASSETS / "faq/zespol-4.png",
    ASSETS / "makers/new/bigrep-logo-mobile-header-opt.png",
    ASSETS / "makers/eufymake.png",
    ASSETS / "makers/formlabs.png",
    ASSETS / "makers/minifactory.png",
    ASSETS / "makers/prusa.png",
    ASSETS / "makers/raise3d.png",
    ASSETS / "makers/sinterit.png",
    ASSETS / "makers/ultimaker.png",
]


def save_webp(src: Path, dst: Path, *, max_width: int | None, quality: int = 82) -> dict:
    if src.suffix.lower() == ".webp" and src.resolve() != dst.resolve():
        dst.write_bytes(src.read_bytes())
        return {"src": str(src.relative_to(ROOT)), "dst": str(dst.relative_to(ROOT)), "copied": True}

    with Image.open(src) as im:
        has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
        if has_alpha:
            im = im.convert("RGBA")
        else:
            im = im.convert("RGB")

        if max_width and im.width > max_width:
            h = round(im.height * max_width / im.width)
            im = im.resize((max_width, h), Image.Resampling.LANCZOS)

        dst.parent.mkdir(parents=True, exist_ok=True)
        if has_alpha:
            im.save(dst, format="WEBP", quality=min(quality + 8, 92), method=6, lossless=False)
        else:
            im.save(dst, format="WEBP", quality=quality, method=6)

    return {
        "src": str(src.relative_to(ROOT)),
        "dst": str(dst.relative_to(ROOT)),
        "src_bytes": src.stat().st_size,
        "dst_bytes": dst.stat().st_size,
    }


def main() -> None:
    log: list[dict] = []
    photos_dir = ASSETS / "makers/photos"
    for slug, src in MAKER_PHOTOS.items():
        dst = photos_dir / f"{slug}.webp"
        if not src.exists():
            raise SystemExit(f"Missing maker photo: {src}")
        log.append({"maker": slug, **save_webp(src, dst, max_width=1200, quality=84)})

    for src in SITE_RASTERS:
        if not src.exists():
            raise SystemExit(f"Missing asset: {src}")
        dst = src.with_suffix(".webp")
        max_w = 1400 if "get3d-" in src.name or "magnific" in src.name else 1600
        if "zespol" in src.name or "logo" in src.name or src.parent.name == "makers":
            max_w = 480
        if "drukarka" in src.name or "ams" in src.name:
            max_w = 900
        log.append(save_webp(src, dst, max_width=max_w, quality=82))

    manifest = ROOT / "scripts" / "webp-manifest.json"
    manifest.write_text(json.dumps(log, indent=2), encoding="utf-8")
    print(f"Wrote {len(log)} WebP files. Manifest: {manifest.relative_to(ROOT)}")


if __name__ == "__main__":
    main()