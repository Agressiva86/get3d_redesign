"""Kopiuj assets/ → public/assets/ (Astro publicDir; brak junction na CI)."""
import shutil
from pathlib import Path

root = Path(__file__).resolve().parents[1]
src = root / "assets"
dst = root / "public" / "assets"

if not src.is_dir():
    raise SystemExit(f"Brak katalogu: {src}")

if dst.exists():
    shutil.rmtree(dst)

shutil.copytree(
    src,
    dst,
    ignore=shutil.ignore_patterns("_pick"),
)
print(f"Skopiowano {src} → {dst}")