from pathlib import Path

root = Path(__file__).resolve().parents[1]
index = (root / "index.html").read_text(encoding="utf-8")
track = (root / "scripts/_makers_track.html").read_text(encoding="utf-8")
marker_start = '      <div class="makers-track" tabindex="0">'
marker_end = '      </div>\n      <div class="wrap makers-foot">'
pre, rest = index.split(marker_start, 1)
_, post = rest.split(marker_end, 1)
index = (
    pre
    + marker_start
    + "\n"
    + track
    + marker_end
    + post
)
index = index.replace(
    '<h2 id="makers-title">Producenci. <span>Drukarki 3D marek z oferty get3D.</span></h2>',
    '<h2 id="makers-title">Drukarki 3D od renomowanych producentów</h2>',
)
index = index.replace("css/styles.css?v=makers9", "css/styles.css?v=makers10")
index = index.replace("js/main.js?v=makers9", "js/main.js?v=makers10")
if "css/styles.css?v=makers10" not in index:
    index = index.replace("css/styles.css?v=makers8", "css/styles.css?v=makers10")
if "js/main.js?v=makers10" not in index:
    index = index.replace("js/main.js?v=makers7", "js/main.js?v=makers10")
(root / "index.html").write_text(index, encoding="utf-8")
print("patched")