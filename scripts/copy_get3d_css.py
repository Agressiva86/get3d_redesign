from pathlib import Path

root = Path(__file__).resolve().parents[1]
src = root / "css" / "styles.css"
text = src.read_text(encoding="utf-8").replace('url("../assets/', 'url("/assets/')
for dst in (
    root / "src" / "styles" / "get3d.css",
    root / "public" / "css" / "get3d.css",
):
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text(text, encoding="utf-8")
    print(f"Wrote {dst} ({len(text)} chars)")