from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IMG = "assets/drukarka-3d-bambu-lab-a1-combo.webp"
IMG_AMS = "assets/bambu-lab-ams-2-pro.webp"


def price(whole, cents="00", prefix="od", save=None, low=None):
    pre = f"<small>{prefix}</small> " if prefix else ""
    html = (
        f'<span class="mega-price"><span class="mega-amount">{pre}{whole}'
        f'<sup>{cents}</sup> <span class="mega-currency">zł</span></span>'
    )
    if save:
        html += f' <span class="mega-save">{save}</span>'
    html += "</span>"
    if save and low:
        html += f'<p class="mega-low">Najniższa cena: {low}&nbsp;zł</p>'
    return html


def prod(name, phtml, img=IMG, href="#drukarki"):
    return f"""          <a class="maker-product" href="{href}">
            <span class="maker-product-shot"><img src="{img}" alt=""></span>
            <span class="maker-product-body">
              <span class="maker-product-name">{name}</span>
              <span class="maker-product-pricing">{phtml}</span>
            </span>
          </a>"""


makers = [
    (
        "Bambu Lab",
        "assets/makers/new/BambuLab_logo.svg.webp",
        "132",
        "bambu-lab",
        "Drukarki Bambu Lab to demony szybkości z wysoką jakością wydruków. AMS pozwala drukować nawet w 16 kolorach, a stosunkowo niska cena sprawia, że te maszyny szybko zdobyły światowe rynki.",
        [
            ("Bambu Lab A1 Combo", price("1&nbsp;160", save="-150&nbsp;zł", low="1&nbsp;310,00")),
            ("Bambu Lab A1 mini", price("845")),
            ("Bambu Lab AMS 2 Pro", price("990", prefix="", save="-300&nbsp;zł", low="1&nbsp;110,00"), IMG_AMS),
        ],
    ),
    (
        "BigRep",
        "assets/makers/new/bigrep-logo-mobile-header-opt.webp",
        "120",
        "bigrep",
        "Drukarki BigRep to coś więcej niż wielkoformatowy sprzęt do dużych elementów. Niemiecka jakość, wysoka wydajność i konkurencyjna cena upraszczają produkcję oraz prototypowanie w firmie.",
        [
            ("BigRep ONE", price("62&nbsp;900")),
            ("BigRep Studio", price("48&nbsp;500")),
            ("BigRep Pro", price("89&nbsp;000")),
        ],
    ),
    (
        "Desktop Metal",
        "assets/makers/new/desktop_metal_BIG.svg",
        "168",
        "desktop-metal",
        "Systemy Desktop Metal służą do druku 3D z metalu. W ofercie get3D znajdziesz rozwiązania od warsztatu po produkcję seryjną precyzyjnych elementów metalowych dla przemysłu i inżynierii.",
        [
            ("Desktop Metal Studio System", price("189&nbsp;000")),
            ("Desktop Metal Shop System", price("325&nbsp;000")),
            ("Desktop Metal PureSinter", price("420&nbsp;000")),
        ],
    ),
    (
        "eufyMake",
        "assets/makers/eufymake.webp",
        "120",
        "eufymake",
        "eufyMake E1 to kompaktowa drukarka 3D do domu i małego warsztatu. Prosta w obsłudze, z szybkim startem i jakością wystarczającą do codziennych projektów twórczych oraz pierwszych serii.",
        [
            ("eufyMake E1", price("2&nbsp;199")),
            ("Zestaw startowy eufyMake", price("2&nbsp;499")),
            ("Filament eufyMake PLA", price("89", prefix="")),
        ],
    ),
    (
        "Formlabs",
        "assets/makers/formlabs.webp",
        "140",
        "formlabs",
        "Urządzenia Formlabs pracują w technologii LFS. To jedne z najpopularniejszych drukarek żywicznych w medycynie – gabinety stomatologiczne i laboratoria wybierają je wraz z oprogramowaniem i żywicą.",
        [
            ("Formlabs Form 4", price("18&nbsp;900")),
            ("Formlabs Form 4L", price("32&nbsp;500")),
            ("Formlabs Form 3+", price("14&nbsp;200")),
        ],
    ),
    (
        "miniFactory",
        "assets/makers/minifactory.webp",
        "160",
        "minifactory",
        "PEEK, PEKK, ULTEM, PPSU, PEI… druk z ultrapolimerów wymaga wysokich temperatur i grzanej komory. miniFactory łączy precyzję, suszenie filamentu i monitoring procesu AARNI bez kompromisów.",
        [
            ("miniFactory Ignite", price("89&nbsp;000")),
            ("miniFactory Ultra 2", price("124&nbsp;000")),
            ("Zestaw suszenia filamentu", price("12&nbsp;400")),
        ],
    ),
    (
        "Prusa",
        "assets/makers/prusa.webp",
        "140",
        "prusa",
        "Wyjmij drukarkę z pudełka, podłącz, przeprowadź Selftest i drukuj. Automatyczna kalibracja, idealna pierwsza warstwa i druk jednym kliknięciem – Prusa do domu, warsztatu lub firmy.",
        [
            ("Original Prusa MK4S", price("4&nbsp;240")),
            ("Original Prusa CORE One+", price("5&nbsp;800")),
            ("Original Prusa XL", price("11&nbsp;000")),
        ],
    ),
    (
        "Raise3D",
        "assets/makers/raise3d.webp",
        "132",
        "raise3d",
        "Raise3D oferuje drukarki dwugłowicowe do warsztatu i produkcji. Seria Pro łączy duże pole robocze, niezawodność oraz możliwość łączenia dwóch materiałów lub kolorów w jednym wydruku.",
        [
            ("Raise3D Pro3", price("24&nbsp;900")),
            ("Raise3D Pro3 HS", price("28&nbsp;900")),
            ("Raise3D E3", price("5&nbsp;890", save="-500&nbsp;zł", low="6&nbsp;390,00")),
        ],
    ),
    (
        "Sinterit",
        "assets/makers/sinterit.webp",
        "132",
        "sinterit",
        "Technologia SLS pozwala uzyskać wydruki o doskonałym odwzorowaniu kształtów. W get3D kupisz urządzenia polskiej firmy Sinterit – zastosowania w branżach są praktycznie nieograniczone.",
        [
            ("Sinterit Lisa X", price("89&nbsp;000")),
            ("Sinterit Suzy", price("54&nbsp;900")),
            ("Zestaw startowy proszków", price("4&nbsp;200")),
        ],
    ),
    (
        "UltiMaker",
        "assets/makers/ultimaker.webp",
        "152",
        "ultimaker",
        "Dwugłowicowe drukarki UltiMaker, takie jak S3 i S5, służą do druku z dwóch filamentów. Sprawdzają się w farmach drukarek oraz w firmach przemysłowych i produkcyjnych w Polsce.",
        [
            ("UltiMaker S5", price("19&nbsp;900")),
            ("UltiMaker Factor 4", price("42&nbsp;500")),
            ("UltiMaker S3", price("15&nbsp;900")),
        ],
    ),
]

blocks = []
for name, logo, w, slug, desc, products in makers:
    logo_tag = f'<img class="maker-logo" src="{logo}" alt="{name}" width="{w}" height="36">'
    prods = []
    for item in products:
        if len(item) == 2:
            prods.append(prod(item[0], item[1]))
        else:
            prods.append(prod(item[0], item[1], item[2]))
    products_html = "\n".join(prods)
    blocks.append(
        f"""        <div class="maker-unit">
          <a class="maker-hero" href="#drukarki">
            <span class="maker-brand">
              <h3 class="maker-name">{logo_tag}</h3>
            </span>
            <span class="maker-card">
              <img class="maker-shot" src="assets/makers/photos/{slug}.webp" alt="">
              <span class="maker-caption">
                <p class="maker-line">{desc}</p>
                <span class="hero-caption-btn hero-caption-btn-solid">Poznaj produkty {name}</span>
              </span>
            </span>
          </a>
          <div class="maker-products">
{products_html}
          </div>
          <a class="mini-link maker-all" href="#drukarki">Zobacz wszystkie produkty</a>
        </div>"""
    )

Path(ROOT / "scripts/_makers_track.html").write_text("\n".join(blocks) + "\n", encoding="utf-8")
print(len(blocks), "units")