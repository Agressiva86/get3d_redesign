import re
from pathlib import Path

sections = Path(__file__).resolve().parents[1] / "src" / "components" / "sections"
import_pat = re.compile(
    r"^\s*import \"\.\./\.\./styles/sections/[^\"]+\";\s*\n",
    re.MULTILINE,
)

for path in sorted(sections.glob("*.astro")):
    text = path.read_text(encoding="utf-8")
    updated = import_pat.sub("", text)
  # normalize frontmatter
    updated = re.sub(
        r"^\s*---\s*\n\s*---\s*\n",
        "---\n---\n",
        updated,
        count=1,
        flags=re.MULTILINE,
    )
    if updated != text:
        path.write_text(updated, encoding="utf-8")
        print("stripped:", path.name)