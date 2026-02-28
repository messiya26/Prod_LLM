import json, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

BASE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(os.path.dirname(BASE), "assets")

NAVY = "#0D2240"
GOLD = "#D4A438"
GOLD_LIGHT = "#F0C75E"
WHITE = "#FFFFFF"
DARK_BG = "#0A1628"
CREAM = "#FFF8E7"
GRAY = "#5A5A5A"
BLUE_ROYAL = "#1B3A6B"
DARK_CARD = "#142842"
WARM_BG = "#1A1410"

W = 13.333
H = 7.5

def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def make_gradient(filename, w_px, h_px, c1, c2, direction="vertical"):
    img = Image.new("RGB", (w_px, h_px))
    draw = ImageDraw.Draw(img)
    r1, g1, b1 = hex_to_rgb(c1)
    r2, g2, b2 = hex_to_rgb(c2)
    steps = h_px if direction == "vertical" else w_px
    for i in range(steps):
        ratio = i / steps
        r = int(r1 + (r2 - r1) * ratio)
        g = int(g1 + (g2 - g1) * ratio)
        b = int(b1 + (b2 - b1) * ratio)
        if direction == "vertical":
            draw.line([(0, i), (w_px, i)], fill=(r, g, b))
        else:
            draw.line([(i, 0), (i, h_px)], fill=(r, g, b))
    path = os.path.join(BASE, filename)
    img.save(path, quality=95)
    return path

def make_rich_bg(filename, base_color, accent_color, style="diagonal"):
    w_px, h_px = 1920, 1080
    img = Image.new("RGB", (w_px, h_px), base_color)
    draw = ImageDraw.Draw(img)
    bc = hex_to_rgb(base_color)
    ac = hex_to_rgb(accent_color)

    if style == "diagonal":
        for i in range(h_px):
            ratio = i / h_px
            r = int(bc[0] + (ac[0] - bc[0]) * ratio * 0.3)
            g = int(bc[1] + (ac[1] - bc[1]) * ratio * 0.3)
            b = int(bc[2] + (ac[2] - bc[2]) * ratio * 0.3)
            draw.line([(0, i), (w_px, i)], fill=(r, g, b))
        for x in range(0, w_px + h_px, 120):
            draw.line([(x, 0), (x - h_px, h_px)], fill=(*ac, ), width=1)
    elif style == "radial":
        for i in range(h_px):
            ratio = i / h_px
            r = int(bc[0] * (1 - ratio * 0.4))
            g = int(bc[1] * (1 - ratio * 0.4))
            b = int(bc[2] * (1 - ratio * 0.4))
            draw.line([(0, i), (w_px, i)], fill=(r, g, b))
        draw.ellipse([w_px//2-400, -200, w_px//2+400, 400], fill=None, outline=(*ac,), width=2)
        draw.ellipse([w_px//2-600, -300, w_px//2+600, 500], fill=None, outline=(*ac,), width=1)
    elif style == "warm":
        for i in range(h_px):
            ratio = i / h_px
            r = int(bc[0] + (ac[0] - bc[0]) * ratio * 0.5)
            g = int(bc[1] + (ac[1] - bc[1]) * ratio * 0.3)
            b = int(bc[2] + (ac[2] - bc[2]) * ratio * 0.2)
            draw.line([(0, i), (w_px, i)], fill=(r, g, b))
        for y in range(0, h_px, 80):
            opacity_mod = int(20 + 10 * ((y % 160) / 160))
            c = (ac[0]//opacity_mod, ac[1]//opacity_mod, ac[2]//opacity_mod)
            draw.line([(0, y), (w_px, y)], fill=c, width=1)
    elif style == "geometric":
        for i in range(h_px):
            ratio = i / h_px
            r = int(bc[0] + (ac[0] - bc[0]) * ratio * 0.2)
            g = int(bc[1] + (ac[1] - bc[1]) * ratio * 0.2)
            b = int(bc[2] + (ac[2] - bc[2]) * ratio * 0.2)
            draw.line([(0, i), (w_px, i)], fill=(r, g, b))
        for x in range(0, w_px, 200):
            for y in range(0, h_px, 200):
                draw.rectangle([x, y, x+1, y+1], fill=(*ac,))
        draw.rectangle([0, h_px-6, w_px, h_px], fill=(*ac,))

    path = os.path.join(BASE, filename)
    img.save(path, quality=95)
    return path

def make_icon(filename, letter, bg, fg="#FFFFFF", sz=140):
    img = Image.new("RGBA", (sz, sz), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([2, 2, sz-2, sz-2], radius=sz//5, fill=bg)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", sz // 3)
    except:
        font = ImageFont.load_default()
    bbox = draw.textbbox((0, 0), letter, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((sz - tw) // 2, (sz - th) // 2 - 4), letter, fill=fg, font=font)
    path = os.path.join(BASE, filename)
    img.save(path)
    return path

# Generate all backgrounds
bg1 = make_rich_bg("bg_v2_dark1.png", DARK_BG, GOLD, "diagonal")
bg2 = make_rich_bg("bg_v2_dark2.png", NAVY, GOLD_LIGHT, "radial")
bg3 = make_rich_bg("bg_v2_warm.png", "#0F1A2E", GOLD, "warm")
bg4 = make_rich_bg("bg_v2_geo.png", BLUE_ROYAL, GOLD, "geometric")
bg5 = make_gradient("bg_v2_grad1.png", 1920, 1080, "#0A1225", BLUE_ROYAL)
bg6 = make_gradient("bg_v2_grad2.png", 1920, 1080, "#111D33", "#0A1628")
bg7 = make_rich_bg("bg_v2_dark3.png", "#0C1526", GOLD_LIGHT, "diagonal")
bg8 = make_rich_bg("bg_v2_dark4.png", "#0E1B30", GOLD, "radial")

# Generate icons
ic = {}
icon_defs = {
    "form": ("F", GOLD), "lead": ("L", BLUE_ROYAL), "dev": ("D", "#8B6914"),
    "vid": ("V", GOLD), "live": ("Z", BLUE_ROYAL), "coach": ("C", "#8B6914"),
    "cert": ("C", GOLD), "forum": ("F", BLUE_ROYAL), "cal": ("E", "#8B6914"),
    "mob": ("M", GOLD), "pay": ("$", BLUE_ROYAL), "sec": ("S", "#8B6914"),
    "star": ("*", GOLD), "admin": ("A", BLUE_ROYAL), "notif": ("N", "#8B6914"),
    "check": ("OK", GOLD), "globe": ("G", BLUE_ROYAL), "rocket": ("R", GOLD),
    "heart": ("H", "#8B2252"), "users": ("U", BLUE_ROYAL), "shield": ("S", GOLD),
    "chart": ("C", BLUE_ROYAL), "ai": ("AI", GOLD), "book": ("B", BLUE_ROYAL),
}
for name, (letter, color) in icon_defs.items():
    ic[name] = make_icon(f"ic_{name}.png", letter, color)

logo = os.path.join(ASSETS, "logo-client.jpeg")
gold_line = make_gradient("gold_line_v2.png", 1920, 8, GOLD, GOLD_LIGHT, "horizontal")

slides = []

# ============================================================
# SLIDE 1 - COUVERTURE
# ============================================================
slides.append({
    "background_image": bg1,
    "elements": [
        {"type": "shape", "shape": "rectangle", "x": 0, "y": 0, "w": 0.08, "h": H, "fill": "D4A438"},
        {"type": "image", "path": logo, "x": 4.5, "y": 0.3, "w": 4.3, "h": 3.1},
        {"type": "shape", "shape": "rectangle", "x": 1, "y": 3.5, "w": 11.3, "h": 0.06, "fill": "D4A438"},
        {"type": "text", "text": "LORD LOMBO ACADEMIE", "x": 0.5, "y": 3.8, "w": 12.3, "h": 1, "font_size": 44, "color": "D4A438", "bold": True, "align": "center", "font": "Georgia"},
        {"type": "text", "text": "Plateforme de Formation Spirituelle, Leadership\n& Developpement Personnel", "x": 1.5, "y": 4.8, "w": 10.3, "h": 0.9, "font_size": 18, "color": "CADCFC", "align": "center", "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 5, "y": 5.9, "w": 3.3, "h": 0.04, "fill": "D4A438"},
        {"type": "text", "text": "PROPOSITION TECHNIQUE & COMPREHENSION DES BESOINS", "x": 1, "y": 6.1, "w": 11.3, "h": 0.5, "font_size": 13, "color": "8899AA", "align": "center"},
        {"type": "text", "text": "Document Confidentiel  |  Fevrier 2026", "x": 1, "y": 6.7, "w": 11.3, "h": 0.4, "font_size": 11, "color": "667788", "align": "center"},
    ]
})

# ============================================================
# SLIDE 2 - SOMMAIRE
# ============================================================
slides.append({
    "background_image": bg5,
    "elements": [
        {"type": "image", "path": gold_line, "x": 0, "y": 0, "w": W, "h": 0.06},
        {"type": "shape", "shape": "rectangle", "x": 0, "y": H-0.06, "w": W, "h": 0.06, "fill": "D4A438"},
        {"type": "text", "text": "SOMMAIRE", "x": 0.8, "y": 0.3, "w": 5, "h": 0.8, "font_size": 34, "color": "D4A438", "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 0.8, "y": 1.05, "w": 2.5, "h": 0.05, "fill": "D4A438"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 0.5, "y": 1.5, "w": 5.8, "h": 5.3, "fill": "0E1B30"},
        {"type": "text", "text": "01   Comprehension du Besoin\n\n02   Vision & Objectifs Strategiques\n\n03   Valeurs Ajoutees de Notre Solution\n\n04   Architecture de la Plateforme\n\n05   Modules Fonctionnels Detailles\n\n06   Methodes Pedagogiques\n\n07   Fonctionnalites Avancees", "x": 0.9, "y": 1.8, "w": 5, "h": 4.8, "font_size": 15, "color": "C8D0D8"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 6.8, "y": 1.5, "w": 5.8, "h": 5.3, "fill": "0E1B30"},
        {"type": "text", "text": "08   Securite & Performance\n\n09   Identite Visuelle & Design\n\n10   Technologies & Stack Technique\n\n11   SEO & Referencement\n\n12   Parcours Utilisateur (UX)\n\n13   Evolutions Futures & Roadmap\n\n14   Pourquoi Nous Choisir", "x": 7.2, "y": 1.8, "w": 5, "h": 4.8, "font_size": 15, "color": "C8D0D8"},

        {"type": "image", "path": logo, "x": 5.4, "y": 5.5, "w": 2.5, "h": 1.2},
    ]
})

# ============================================================
# SLIDE 3 - COMPREHENSION DU BESOIN
# ============================================================
slides.append({
    "background_image": bg3,
    "elements": [
        {"type": "shape", "shape": "rectangle", "x": 0, "y": 0, "w": 0.08, "h": H, "fill": "D4A438"},
        {"type": "text", "text": "01", "x": 0.4, "y": 0.2, "w": 1.5, "h": 0.8, "font_size": 48, "color": "D4A438", "bold": True, "font": "Georgia"},
        {"type": "text", "text": "COMPREHENSION DU BESOIN", "x": 2, "y": 0.3, "w": 10, "h": 0.7, "font_size": 26, "color": "FFFFFF", "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 2, "y": 0.95, "w": 4, "h": 0.04, "fill": "D4A438"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 0.3, "y": 1.3, "w": 6.2, "h": 3, "fill": "0E1B30"},
        {"type": "text", "text": "LE PROJET", "x": 0.6, "y": 1.5, "w": 2, "h": 0.4, "font_size": 14, "color": "D4A438", "bold": True},
        {"type": "text", "text": "Lord Lombo Academie est une plateforme e-learning premium dediee a la transformation spirituelle, au leadership chretien et au developpement personnel. Elle accompagne des individus dans leur croissance interieure, renforce leur influence en tant que leaders et leur permet d'impacter positivement leur environnement.", "x": 0.6, "y": 2.0, "w": 5.6, "h": 2, "font_size": 12, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 6.8, "y": 1.3, "w": 6.2, "h": 3, "fill": "0E1B30"},
        {"type": "text", "text": "LA CIBLE", "x": 7.1, "y": 1.5, "w": 2, "h": 0.4, "font_size": 14, "color": "D4A438", "bold": True},
        {"type": "text", "text": "- Leaders en quete de croissance interieure\n- Chretiens desireux de se former\n- Jeunes leaders en developpement\n- Communaute francophone mondiale\n- Pasteurs et responsables d'eglise\n- Professionnels en reconversion", "x": 7.1, "y": 2.0, "w": 5.6, "h": 2, "font_size": 12, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 0.3, "y": 4.5, "w": 12.7, "h": 2.6, "fill": "0E1B30"},
        {"type": "text", "text": "BESOINS IDENTIFIES & EXIGENCES", "x": 0.6, "y": 4.7, "w": 5, "h": 0.4, "font_size": 14, "color": "D4A438", "bold": True},

        {"type": "image", "path": ic["check"], "x": 0.7, "y": 5.3, "w": 0.35, "h": 0.35},
        {"type": "text", "text": "Plateforme moderne & inspirante", "x": 1.2, "y": 5.3, "w": 3, "h": 0.35, "font_size": 11, "color": "C8D0D8"},
        {"type": "image", "path": ic["check"], "x": 0.7, "y": 5.75, "w": 0.35, "h": 0.35},
        {"type": "text", "text": "Formations spirituelles accessibles", "x": 1.2, "y": 5.75, "w": 3, "h": 0.35, "font_size": 11, "color": "C8D0D8"},
        {"type": "image", "path": ic["check"], "x": 0.7, "y": 6.2, "w": 0.35, "h": 0.35},
        {"type": "text", "text": "Inscription, paiement & suivi securise", "x": 1.2, "y": 6.2, "w": 3, "h": 0.35, "font_size": 11, "color": "C8D0D8"},

        {"type": "image", "path": ic["check"], "x": 4.5, "y": 5.3, "w": 0.35, "h": 0.35},
        {"type": "text", "text": "Mesure satisfaction & impact", "x": 5.0, "y": 5.3, "w": 3, "h": 0.35, "font_size": 11, "color": "C8D0D8"},
        {"type": "image", "path": ic["check"], "x": 4.5, "y": 5.75, "w": 0.35, "h": 0.35},
        {"type": "text", "text": "Communaute engagee", "x": 5.0, "y": 5.75, "w": 3, "h": 0.35, "font_size": 11, "color": "C8D0D8"},
        {"type": "image", "path": ic["check"], "x": 4.5, "y": 6.2, "w": 0.35, "h": 0.35},
        {"type": "text", "text": "Design haut de gamme responsive", "x": 5.0, "y": 6.2, "w": 3, "h": 0.35, "font_size": 11, "color": "C8D0D8"},

        {"type": "image", "path": ic["check"], "x": 8.5, "y": 5.3, "w": 0.35, "h": 0.35},
        {"type": "text", "text": "Coaching live & enregistre", "x": 9.0, "y": 5.3, "w": 3.5, "h": 0.35, "font_size": 11, "color": "C8D0D8"},
        {"type": "image", "path": ic["check"], "x": 8.5, "y": 5.75, "w": 0.35, "h": 0.35},
        {"type": "text", "text": "Certificats & attestations auto", "x": 9.0, "y": 5.75, "w": 3.5, "h": 0.35, "font_size": 11, "color": "C8D0D8"},
        {"type": "image", "path": ic["check"], "x": 8.5, "y": 6.2, "w": 0.35, "h": 0.35},
        {"type": "text", "text": "Multi-paiement (Carte, PayPal, MoMo)", "x": 9.0, "y": 6.2, "w": 3.5, "h": 0.35, "font_size": 11, "color": "C8D0D8"},
    ]
})

# ============================================================
# SLIDE 4 - VISION & OBJECTIFS
# ============================================================
slides.append({
    "background_image": bg2,
    "elements": [
        {"type": "image", "path": gold_line, "x": 0, "y": 0, "w": W, "h": 0.06},
        {"type": "shape", "shape": "rectangle", "x": 0, "y": H-0.06, "w": W, "h": 0.06, "fill": "D4A438"},
        {"type": "text", "text": "02  VISION & OBJECTIFS STRATEGIQUES", "x": 0.5, "y": 0.2, "w": 12, "h": 0.7, "font_size": 26, "color": "FFFFFF", "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 0.5, "y": 0.85, "w": 4, "h": 0.04, "fill": "D4A438"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 0.3, "y": 1.2, "w": 4, "h": 3.2, "fill": "0E1B30"},
        {"type": "image", "path": ic["form"], "x": 1.8, "y": 1.4, "w": 0.7, "h": 0.7},
        {"type": "text", "text": "FORMER", "x": 0.5, "y": 2.2, "w": 3.6, "h": 0.4, "font_size": 20, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "Offrir des parcours de formation structurees et certifiantes en croissance spirituelle, leadership et influence", "x": 0.5, "y": 2.7, "w": 3.6, "h": 1.4, "font_size": 12, "color": "B0B8C0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 4.6, "y": 1.2, "w": 4, "h": 3.2, "fill": "0E1B30"},
        {"type": "image", "path": ic["heart"], "x": 6.1, "y": 1.4, "w": 0.7, "h": 0.7},
        {"type": "text", "text": "TRANSFORMER", "x": 4.8, "y": 2.2, "w": 3.6, "h": 0.4, "font_size": 20, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "Accompagner chaque apprenant dans une transformation profonde et durable a travers un suivi personnalise et du coaching", "x": 4.8, "y": 2.7, "w": 3.6, "h": 1.4, "font_size": 12, "color": "B0B8C0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 8.9, "y": 1.2, "w": 4, "h": 3.2, "fill": "0E1B30"},
        {"type": "image", "path": ic["globe"], "x": 10.4, "y": 1.4, "w": 0.7, "h": 0.7},
        {"type": "text", "text": "IMPACTER", "x": 9.1, "y": 2.2, "w": 3.6, "h": 0.4, "font_size": 20, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "Creer une communaute de leaders influents qui impactent positivement leur environnement, en Afrique et dans la diaspora", "x": 9.1, "y": 2.7, "w": 3.6, "h": 1.4, "font_size": 12, "color": "B0B8C0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 0.3, "y": 4.7, "w": 12.7, "h": 2.4, "fill": "0E1B30"},
        {"type": "text", "text": "\"Devenir LA reference dans l'espace francophone pour la formation spirituelle,\nle leadership et le developpement personnel, en combinant technologie de pointe\net accompagnement humain de qualite.\"", "x": 1, "y": 5.0, "w": 11.3, "h": 1.2, "font_size": 16, "color": "D4A438", "align": "center", "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 5.5, "y": 6.3, "w": 2.3, "h": 0.04, "fill": "D4A438"},
        {"type": "text", "text": "Lord Lombo Academie - Vision 2026", "x": 3, "y": 6.4, "w": 7.3, "h": 0.4, "font_size": 12, "color": "8899AA", "align": "center"},
    ]
})

# ============================================================
# SLIDE 5 - VALEURS AJOUTEES
# ============================================================
slides.append({
    "background_image": bg7,
    "elements": [
        {"type": "shape", "shape": "rectangle", "x": 0, "y": 0, "w": 0.08, "h": H, "fill": "D4A438"},
        {"type": "text", "text": "03", "x": 0.4, "y": 0.2, "w": 1.5, "h": 0.7, "font_size": 48, "color": "D4A438", "bold": True, "font": "Georgia"},
        {"type": "text", "text": "VALEURS AJOUTEES DE NOTRE SOLUTION", "x": 2, "y": 0.3, "w": 10, "h": 0.7, "font_size": 26, "color": "FFFFFF", "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 2, "y": 0.95, "w": 4, "h": 0.04, "fill": "D4A438"},

        # Row 1
        {"type": "shape", "shape": "rounded_rectangle", "x": 0.3, "y": 1.3, "w": 4.1, "h": 2.7, "fill": "0E1B30"},
        {"type": "image", "path": ic["rocket"], "x": 1.9, "y": 1.5, "w": 0.6, "h": 0.6},
        {"type": "text", "text": "EXPERIENCE PREMIUM", "x": 0.5, "y": 2.2, "w": 3.7, "h": 0.4, "font_size": 14, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "Interface haut de gamme, design inspire, animations fluides. Chaque interaction reflete l'excellence et la vision de Lord Lombo.", "x": 0.5, "y": 2.7, "w": 3.7, "h": 1.2, "font_size": 11, "color": "B0B8C0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 4.6, "y": 1.3, "w": 4.1, "h": 2.7, "fill": "0E1B30"},
        {"type": "image", "path": ic["shield"], "x": 6.2, "y": 1.5, "w": 0.6, "h": 0.6},
        {"type": "text", "text": "SECURITE SANS FAILLE", "x": 4.8, "y": 2.2, "w": 3.7, "h": 0.4, "font_size": 14, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "Chiffrement SSL, 2FA, protection DDoS, conformite RGPD, paiements securises PCI-DSS. Vos donnees sont sacrees.", "x": 4.8, "y": 2.7, "w": 3.7, "h": 1.2, "font_size": 11, "color": "B0B8C0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 8.9, "y": 1.3, "w": 4.1, "h": 2.7, "fill": "0E1B30"},
        {"type": "image", "path": ic["chart"], "x": 10.5, "y": 1.5, "w": 0.6, "h": 0.6},
        {"type": "text", "text": "ANALYTICS PUISSANTS", "x": 9.1, "y": 2.2, "w": 3.7, "h": 0.4, "font_size": 14, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "Tableaux de bord en temps reel, suivi de progression, rapports de satisfaction, KPI detailles pour piloter l'academie.", "x": 9.1, "y": 2.7, "w": 3.7, "h": 1.2, "font_size": 11, "color": "B0B8C0", "align": "center"},

        # Row 2
        {"type": "shape", "shape": "rounded_rectangle", "x": 0.3, "y": 4.2, "w": 4.1, "h": 2.7, "fill": "0E1B30"},
        {"type": "image", "path": ic["users"], "x": 1.9, "y": 4.4, "w": 0.6, "h": 0.6},
        {"type": "text", "text": "COMMUNAUTE ENGAGEE", "x": 0.5, "y": 5.1, "w": 3.7, "h": 0.4, "font_size": 14, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "Forum, defis collectifs, temoignages, espace de priere. Une vraie famille spirituelle connectee autour de la vision.", "x": 0.5, "y": 5.6, "w": 3.7, "h": 1.2, "font_size": 11, "color": "B0B8C0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 4.6, "y": 4.2, "w": 4.1, "h": 2.7, "fill": "0E1B30"},
        {"type": "image", "path": ic["mob"], "x": 6.2, "y": 4.4, "w": 0.6, "h": 0.6},
        {"type": "text", "text": "100% MOBILE READY", "x": 4.8, "y": 5.1, "w": 3.7, "h": 0.4, "font_size": 14, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "Responsive design mobile-first, PWA installable, experience native sur tous les ecrans. Apprendre partout, tout le temps.", "x": 4.8, "y": 5.6, "w": 3.7, "h": 1.2, "font_size": 11, "color": "B0B8C0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 8.9, "y": 4.2, "w": 4.1, "h": 2.7, "fill": "0E1B30"},
        {"type": "image", "path": ic["ai"], "x": 10.5, "y": 4.4, "w": 0.6, "h": 0.6},
        {"type": "text", "text": "TECHNOLOGIES DE POINTE", "x": 9.1, "y": 5.1, "w": 3.7, "h": 0.4, "font_size": 14, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "Next.js, NestJS, PostgreSQL, Redis, CDN mondial, streaming HLS adaptatif. Le meilleur de la tech au service de la foi.", "x": 9.1, "y": 5.6, "w": 3.7, "h": 1.2, "font_size": 11, "color": "B0B8C0", "align": "center"},
    ]
})

# ============================================================
# SLIDE 6 - ARCHITECTURE PLATEFORME
# ============================================================
slides.append({
    "background_image": bg6,
    "elements": [
        {"type": "image", "path": gold_line, "x": 0, "y": 0, "w": W, "h": 0.06},
        {"type": "shape", "shape": "rectangle", "x": 0, "y": H-0.06, "w": W, "h": 0.06, "fill": "D4A438"},
        {"type": "text", "text": "04  ARCHITECTURE DE LA PLATEFORME", "x": 0.5, "y": 0.2, "w": 12, "h": 0.7, "font_size": 26, "color": "FFFFFF", "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 0.5, "y": 0.85, "w": 4, "h": 0.04, "fill": "D4A438"},

        # 6 cards
        {"type": "shape", "shape": "rounded_rectangle", "x": 0.3, "y": 1.2, "w": 4.1, "h": 2.7, "fill": "142842"},
        {"type": "image", "path": ic["book"], "x": 0.6, "y": 1.4, "w": 0.5, "h": 0.5},
        {"type": "text", "text": "PAGE D'ACCUEIL", "x": 1.2, "y": 1.45, "w": 3, "h": 0.4, "font_size": 15, "color": "D4A438", "bold": True},
        {"type": "text", "text": "- Message de bienvenue & vision\n- Video inspirante de Lord Lombo\n- Apercu des formations phares\n- CTA : Commence ta transformation\n- Temoignages en avant-premiere", "x": 0.6, "y": 2.1, "w": 3.5, "h": 1.7, "font_size": 11, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 4.6, "y": 1.2, "w": 4.1, "h": 2.7, "fill": "142842"},
        {"type": "image", "path": ic["heart"], "x": 4.9, "y": 1.4, "w": 0.5, "h": 0.5},
        {"type": "text", "text": "A PROPOS", "x": 5.5, "y": 1.45, "w": 3, "h": 0.4, "font_size": 15, "color": "D4A438", "bold": True},
        {"type": "text", "text": "- Presentation Lord Lombo\n- Mission, vision & fondements\n- Histoire de l'academie\n- Temoignages d'apprenants\n- Equipe pedagogique", "x": 4.9, "y": 2.1, "w": 3.5, "h": 1.7, "font_size": 11, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 8.9, "y": 1.2, "w": 4.1, "h": 2.7, "fill": "142842"},
        {"type": "image", "path": ic["form"], "x": 9.2, "y": 1.4, "w": 0.5, "h": 0.5},
        {"type": "text", "text": "PROGRAMMES & FORMATIONS", "x": 9.8, "y": 1.45, "w": 3, "h": 0.4, "font_size": 15, "color": "D4A438", "bold": True},
        {"type": "text", "text": "- Catalogue avec filtres par theme\n- Fiche detaillee par formation\n- Formateur, duree, prix, avis\n- Prerequis & objectifs\n- Module de recherche avancee", "x": 9.2, "y": 2.1, "w": 3.5, "h": 1.7, "font_size": 11, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 0.3, "y": 4.1, "w": 4.1, "h": 2.9, "fill": "142842"},
        {"type": "image", "path": ic["users"], "x": 0.6, "y": 4.3, "w": 0.5, "h": 0.5},
        {"type": "text", "text": "ESPACE MEMBRE", "x": 1.2, "y": 4.35, "w": 3, "h": 0.4, "font_size": 15, "color": "D4A438", "bold": True},
        {"type": "text", "text": "- Dashboard personnel\n- Suivi progression (barre %)\n- Certificats & attestations PDF\n- Historique des formations\n- Espace Defis pratiques\n- Profil & parametres", "x": 0.6, "y": 5.0, "w": 3.5, "h": 1.8, "font_size": 11, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 4.6, "y": 4.1, "w": 4.1, "h": 2.9, "fill": "142842"},
        {"type": "image", "path": ic["pay"], "x": 4.9, "y": 4.3, "w": 0.5, "h": 0.5},
        {"type": "text", "text": "PAIEMENT EN LIGNE", "x": 5.5, "y": 4.35, "w": 3, "h": 0.4, "font_size": 15, "color": "D4A438", "bold": True},
        {"type": "text", "text": "- Carte bancaire (Stripe)\n- PayPal Business\n- Mobile Money (MTN, Orange, Airtel)\n- Recus & factures automatiques\n- Abonnement mensuel/annuel\n- Codes promo & reductions", "x": 4.9, "y": 5.0, "w": 3.5, "h": 1.8, "font_size": 11, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 8.9, "y": 4.1, "w": 4.1, "h": 2.9, "fill": "142842"},
        {"type": "image", "path": ic["admin"], "x": 9.2, "y": 4.3, "w": 0.5, "h": 0.5},
        {"type": "text", "text": "ESPACE ADMINISTRATEUR", "x": 9.8, "y": 4.35, "w": 3, "h": 0.4, "font_size": 15, "color": "D4A438", "bold": True},
        {"type": "text", "text": "- Gestion utilisateurs & roles\n- Ajout/modification programmes\n- Statistiques en temps reel\n- Rapports satisfaction\n- Gestion paiements & refunds\n- Moderation forum", "x": 9.2, "y": 5.0, "w": 3.5, "h": 1.8, "font_size": 11, "color": "B0B8C0"},
    ]
})

# ============================================================
# SLIDE 7 - EVALUATION & SATISFACTION
# ============================================================
slides.append({
    "background_image": bg8,
    "elements": [
        {"type": "shape", "shape": "rectangle", "x": 0, "y": 0, "w": 0.08, "h": H, "fill": "D4A438"},
        {"type": "text", "text": "05", "x": 0.4, "y": 0.2, "w": 1.5, "h": 0.7, "font_size": 48, "color": "D4A438", "bold": True, "font": "Georgia"},
        {"type": "text", "text": "EVALUATION & SATISFACTION", "x": 2, "y": 0.3, "w": 10, "h": 0.7, "font_size": 26, "color": "FFFFFF", "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 2, "y": 0.95, "w": 4, "h": 0.04, "fill": "D4A438"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 0.3, "y": 1.3, "w": 6.2, "h": 5.7, "fill": "0E1B30"},
        {"type": "text", "text": "SYSTEME D'EVALUATION", "x": 0.6, "y": 1.5, "w": 5, "h": 0.4, "font_size": 15, "color": "D4A438", "bold": True},
        {"type": "text", "text": "Questionnaire automatique\nApres chaque module et chaque formation, un questionnaire de satisfaction est automatiquement envoye a l'apprenant.\n\nNotation par etoiles (1 a 5)\nChaque formation, formateur et module peut etre note individuellement avec un systeme d'etoiles intuitif.\n\nCommentaires detailles\nLes apprenants peuvent laisser des avis textuels visibles par les futurs inscrits, creant un effet de confiance.\n\nRapport de satisfaction\nL'equipe admin dispose d'un dashboard dedie avec taux de satisfaction, NPS, tendances et alertes automatiques.", "x": 0.6, "y": 2.0, "w": 5.6, "h": 4.8, "font_size": 12, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 6.8, "y": 1.3, "w": 6.2, "h": 2.6, "fill": "0E1B30"},
        {"type": "text", "text": "INDICATEURS CLES (KPI)", "x": 7.1, "y": 1.5, "w": 5, "h": 0.4, "font_size": 15, "color": "D4A438", "bold": True},
        {"type": "text", "text": "- Taux de completion des formations\n- Score moyen de satisfaction\n- Net Promoter Score (NPS)\n- Taux de retention des abonnes\n- Nombre d'inscriptions / mois\n- Revenus par formation", "x": 7.1, "y": 2.0, "w": 5.6, "h": 1.7, "font_size": 12, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 6.8, "y": 4.1, "w": 6.2, "h": 2.9, "fill": "0E1B30"},
        {"type": "text", "text": "SUIVI DE PROGRESSION", "x": 7.1, "y": 4.3, "w": 5, "h": 0.4, "font_size": 15, "color": "D4A438", "bold": True},
        {"type": "text", "text": "- Barre de progression visuelle (%)\n- Historique complet des formations\n- Badges & recompenses gamifiees\n- Rappels automatiques (email/push)\n- Tableaux comparatifs avant/apres\n- Export des resultats en PDF", "x": 7.1, "y": 4.8, "w": 5.6, "h": 1.8, "font_size": 12, "color": "B0B8C0"},
    ]
})

# ============================================================
# SLIDE 8 - METHODES PEDAGOGIQUES
# ============================================================
slides.append({
    "background_image": bg4,
    "elements": [
        {"type": "image", "path": gold_line, "x": 0, "y": 0, "w": W, "h": 0.06},
        {"type": "shape", "shape": "rectangle", "x": 0, "y": H-0.06, "w": W, "h": 0.06, "fill": "D4A438"},
        {"type": "text", "text": "06  METHODES PEDAGOGIQUES", "x": 0.5, "y": 0.2, "w": 12, "h": 0.7, "font_size": 26, "color": "FFFFFF", "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 0.5, "y": 0.85, "w": 4, "h": 0.04, "fill": "D4A438"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 0.3, "y": 1.2, "w": 4.1, "h": 4, "fill": "0C1526"},
        {"type": "image", "path": ic["vid"], "x": 1.9, "y": 1.4, "w": 0.7, "h": 0.7},
        {"type": "text", "text": "COURS ENREGISTRES", "x": 0.5, "y": 2.2, "w": 3.7, "h": 0.4, "font_size": 16, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "- Videos HD pre-enregistrees 24h/24\n- Documents PDF complementaires\n- Fichiers audio (podcasts)\n- Quiz interactifs par module\n- Acces illimite a vie\n- Suivi automatique progression\n- Sous-titres multilingues", "x": 0.5, "y": 2.7, "w": 3.7, "h": 2.3, "font_size": 11, "color": "B0B8C0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 4.6, "y": 1.2, "w": 4.1, "h": 4, "fill": "0C1526"},
        {"type": "image", "path": ic["live"], "x": 6.2, "y": 1.4, "w": 0.7, "h": 0.7},
        {"type": "text", "text": "SESSIONS EN DIRECT", "x": 4.8, "y": 2.2, "w": 3.7, "h": 0.4, "font_size": 16, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "- Integration Zoom / Google Meet\n- Lien dans l'espace membre\n- Notifications & rappels auto\n- Interaction en temps reel\n- Questions, priere, coaching\n- Replays pour les absents\n- Chat en direct", "x": 4.8, "y": 2.7, "w": 3.7, "h": 2.3, "font_size": 11, "color": "B0B8C0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 8.9, "y": 1.2, "w": 4.1, "h": 4, "fill": "0C1526"},
        {"type": "image", "path": ic["coach"], "x": 10.5, "y": 1.4, "w": 0.7, "h": 0.7},
        {"type": "text", "text": "PARCOURS PERSONNALISE", "x": 9.1, "y": 2.2, "w": 3.7, "h": 0.4, "font_size": 16, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "- Mix videos + sessions live\n- Coaching individuel premium\n- Coaching de groupe\n- Defis pratiques hebdomadaires\n- Exercices d'application\n- Mentorat personnalise\n- Suivi par formateur dedie", "x": 9.1, "y": 2.7, "w": 3.7, "h": 2.3, "font_size": 11, "color": "B0B8C0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 0.3, "y": 5.5, "w": 12.7, "h": 1.5, "fill": "0C1526"},
        {"type": "text", "text": "MODELE HYBRIDE INNOVANT", "x": 0.6, "y": 5.7, "w": 4, "h": 0.4, "font_size": 14, "color": "D4A438", "bold": True},
        {"type": "text", "text": "La combinaison strategique de ces 3 approches garantit une experience d'apprentissage complete, flexible et adaptee a chaque profil. L'apprenant choisit son rythme tout en beneficiant d'un accompagnement humain de qualite. Les defis pratiques ancrent les enseignements dans le quotidien.", "x": 0.6, "y": 6.15, "w": 12.1, "h": 0.8, "font_size": 11, "color": "B0B8C0"},
    ]
})

# ============================================================
# SLIDE 9 - FONCTIONNALITES AVANCEES
# ============================================================
slides.append({
    "background_image": bg3,
    "elements": [
        {"type": "shape", "shape": "rectangle", "x": 0, "y": 0, "w": 0.08, "h": H, "fill": "D4A438"},
        {"type": "text", "text": "07", "x": 0.4, "y": 0.2, "w": 1.5, "h": 0.7, "font_size": 48, "color": "D4A438", "bold": True, "font": "Georgia"},
        {"type": "text", "text": "FONCTIONNALITES AVANCEES", "x": 2, "y": 0.3, "w": 10, "h": 0.7, "font_size": 26, "color": "FFFFFF", "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 2, "y": 0.95, "w": 4, "h": 0.04, "fill": "D4A438"},

        # 2 rows x 5 cols = 10 features
        {"type": "shape", "shape": "rounded_rectangle", "x": 0.2, "y": 1.3, "w": 2.4, "h": 2.6, "fill": "0E1B30"},
        {"type": "image", "path": ic["mob"], "x": 1, "y": 1.5, "w": 0.5, "h": 0.5},
        {"type": "text", "text": "Responsive &\nMobile First", "x": 0.3, "y": 2.1, "w": 2.2, "h": 0.5, "font_size": 11, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "PWA installable, experience native sur tous ecrans", "x": 0.3, "y": 2.65, "w": 2.2, "h": 0.8, "font_size": 10, "color": "A0A8B0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 2.8, "y": 1.3, "w": 2.4, "h": 2.6, "fill": "0E1B30"},
        {"type": "image", "path": ic["cert"], "x": 3.6, "y": 1.5, "w": 0.5, "h": 0.5},
        {"type": "text", "text": "Certificats\nAutomatiques", "x": 2.9, "y": 2.1, "w": 2.2, "h": 0.5, "font_size": 11, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "PDF personnalise avec QR de verification", "x": 2.9, "y": 2.65, "w": 2.2, "h": 0.8, "font_size": 10, "color": "A0A8B0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 5.4, "y": 1.3, "w": 2.4, "h": 2.6, "fill": "0E1B30"},
        {"type": "image", "path": ic["notif"], "x": 6.2, "y": 1.5, "w": 0.5, "h": 0.5},
        {"type": "text", "text": "Notifications\nIntelligentes", "x": 5.5, "y": 2.1, "w": 2.2, "h": 0.5, "font_size": 11, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "Email, push, SMS rappels & relances auto", "x": 5.5, "y": 2.65, "w": 2.2, "h": 0.8, "font_size": 10, "color": "A0A8B0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 8, "y": 1.3, "w": 2.4, "h": 2.6, "fill": "0E1B30"},
        {"type": "image", "path": ic["forum"], "x": 8.8, "y": 1.5, "w": 0.5, "h": 0.5},
        {"type": "text", "text": "Forum\nCommunautaire", "x": 8.1, "y": 2.1, "w": 2.2, "h": 0.5, "font_size": 11, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "Echanges, entraide, temoignages partages", "x": 8.1, "y": 2.65, "w": 2.2, "h": 0.8, "font_size": 10, "color": "A0A8B0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 10.6, "y": 1.3, "w": 2.4, "h": 2.6, "fill": "0E1B30"},
        {"type": "image", "path": ic["cal"], "x": 11.4, "y": 1.5, "w": 0.5, "h": 0.5},
        {"type": "text", "text": "Calendrier\nEvenements", "x": 10.7, "y": 2.1, "w": 2.2, "h": 0.5, "font_size": 11, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "Sessions live, webinaires, conferences", "x": 10.7, "y": 2.65, "w": 2.2, "h": 0.8, "font_size": 10, "color": "A0A8B0", "align": "center"},

        # Row 2
        {"type": "shape", "shape": "rounded_rectangle", "x": 0.2, "y": 4.2, "w": 2.4, "h": 2.6, "fill": "0E1B30"},
        {"type": "image", "path": ic["chart"], "x": 1, "y": 4.4, "w": 0.5, "h": 0.5},
        {"type": "text", "text": "Dashboard\nAnalytics", "x": 0.3, "y": 5.0, "w": 2.2, "h": 0.5, "font_size": 11, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "KPI, rapports, stats en temps reel", "x": 0.3, "y": 5.55, "w": 2.2, "h": 0.8, "font_size": 10, "color": "A0A8B0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 2.8, "y": 4.2, "w": 2.4, "h": 2.6, "fill": "0E1B30"},
        {"type": "image", "path": ic["star"], "x": 3.6, "y": 4.4, "w": 0.5, "h": 0.5},
        {"type": "text", "text": "Evaluation\n& Avis", "x": 2.9, "y": 5.0, "w": 2.2, "h": 0.5, "font_size": 11, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "Etoiles, questionnaires, NPS", "x": 2.9, "y": 5.55, "w": 2.2, "h": 0.8, "font_size": 10, "color": "A0A8B0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 5.4, "y": 4.2, "w": 2.4, "h": 2.6, "fill": "0E1B30"},
        {"type": "image", "path": ic["pay"], "x": 6.2, "y": 4.4, "w": 0.5, "h": 0.5},
        {"type": "text", "text": "Multi-\nPaiement", "x": 5.5, "y": 5.0, "w": 2.2, "h": 0.5, "font_size": 11, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "Carte, PayPal, Mobile Money, codes promo", "x": 5.5, "y": 5.55, "w": 2.2, "h": 0.8, "font_size": 10, "color": "A0A8B0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 8, "y": 4.2, "w": 2.4, "h": 2.6, "fill": "0E1B30"},
        {"type": "image", "path": ic["shield"], "x": 8.8, "y": 4.4, "w": 0.5, "h": 0.5},
        {"type": "text", "text": "Securite\nRenforcee", "x": 8.1, "y": 5.0, "w": 2.2, "h": 0.5, "font_size": 11, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "SSL, 2FA, RGPD, WAF, DDoS protect", "x": 8.1, "y": 5.55, "w": 2.2, "h": 0.8, "font_size": 10, "color": "A0A8B0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 10.6, "y": 4.2, "w": 2.4, "h": 2.6, "fill": "0E1B30"},
        {"type": "image", "path": ic["book"], "x": 11.4, "y": 4.4, "w": 0.5, "h": 0.5},
        {"type": "text", "text": "Defis\nSpirituels", "x": 10.7, "y": 5.0, "w": 2.2, "h": 0.5, "font_size": 11, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "Exercices pratiques quotidiens & suivi", "x": 10.7, "y": 5.55, "w": 2.2, "h": 0.8, "font_size": 10, "color": "A0A8B0", "align": "center"},
    ]
})

# ============================================================
# SLIDE 10 - SECURITE & PERFORMANCE
# ============================================================
slides.append({
    "background_image": bg2,
    "elements": [
        {"type": "image", "path": gold_line, "x": 0, "y": 0, "w": W, "h": 0.06},
        {"type": "shape", "shape": "rectangle", "x": 0, "y": H-0.06, "w": W, "h": 0.06, "fill": "D4A438"},
        {"type": "text", "text": "08  SECURITE & PERFORMANCE", "x": 0.5, "y": 0.2, "w": 12, "h": 0.7, "font_size": 26, "color": "FFFFFF", "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 0.5, "y": 0.85, "w": 4, "h": 0.04, "fill": "D4A438"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 0.3, "y": 1.2, "w": 6.2, "h": 5.8, "fill": "0A1628"},
        {"type": "image", "path": ic["shield"], "x": 0.6, "y": 1.4, "w": 0.5, "h": 0.5},
        {"type": "text", "text": "SECURITE DE NIVEAU BANCAIRE", "x": 1.2, "y": 1.45, "w": 5, "h": 0.4, "font_size": 16, "color": "D4A438", "bold": True},
        {"type": "text", "text": "Certificat SSL / HTTPS sur tout le site\nAuthentification a 2 facteurs (2FA)\nChiffrement AES-256 des donnees sensibles\nProtection anti-DDoS & WAF (Web Application Firewall)\nConformite RGPD totale\nSauvegardes automatiques quotidiennes (3 sites)\nAudit de securite trimestriel par un tiers\nPaiements PCI-DSS compliant\nProtection contre injections SQL & XSS\nGestion fine des roles & permissions\nJournalisation complete des acces (audit trail)\nTokens JWT avec expiration courte", "x": 0.6, "y": 2.1, "w": 5.6, "h": 4.7, "font_size": 12, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 6.8, "y": 1.2, "w": 6.2, "h": 5.8, "fill": "0A1628"},
        {"type": "image", "path": ic["rocket"], "x": 7.1, "y": 1.4, "w": 0.5, "h": 0.5},
        {"type": "text", "text": "PERFORMANCE OPTIMALE", "x": 7.7, "y": 1.45, "w": 5, "h": 0.4, "font_size": 16, "color": "D4A438", "bold": True},
        {"type": "text", "text": "CDN mondial Cloudflare pour streaming video\nCache intelligent Redis (sessions & requetes)\nTemps de chargement < 2 secondes garanti\nArchitecture cloud scalable (AWS)\nBase PostgreSQL optimisee avec index avances\nMonitoring 24/7 avec alertes Datadog\n99.9% de disponibilite garantie (SLA)\nStreaming HLS adaptatif (qualite auto)\nLazy loading & code splitting\nCompression Brotli / Gzip\nOptimisation images WebP automatique\nEdge computing pour latence minimale", "x": 7.1, "y": 2.1, "w": 5.6, "h": 4.7, "font_size": 12, "color": "B0B8C0"},
    ]
})

# ============================================================
# SLIDE 11 - IDENTITE VISUELLE
# ============================================================
slides.append({
    "background_image": bg5,
    "elements": [
        {"type": "shape", "shape": "rectangle", "x": 0, "y": 0, "w": 0.08, "h": H, "fill": "D4A438"},
        {"type": "text", "text": "09", "x": 0.4, "y": 0.2, "w": 1.5, "h": 0.7, "font_size": 48, "color": "D4A438", "bold": True, "font": "Georgia"},
        {"type": "text", "text": "IDENTITE VISUELLE & DESIGN", "x": 2, "y": 0.3, "w": 10, "h": 0.7, "font_size": 26, "color": "FFFFFF", "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 2, "y": 0.95, "w": 4, "h": 0.04, "fill": "D4A438"},

        {"type": "text", "text": "PALETTE DE COULEURS", "x": 0.5, "y": 1.3, "w": 4, "h": 0.4, "font_size": 14, "color": "D4A438", "bold": True},
        {"type": "shape", "shape": "rounded_rectangle", "x": 0.5, "y": 1.8, "w": 2.2, "h": 1.4, "fill": "1B3A6B"},
        {"type": "text", "text": "Bleu Royal\n#1B3A6B", "x": 0.5, "y": 2, "w": 2.2, "h": 0.8, "font_size": 11, "color": "FFFFFF", "align": "center"},
        {"type": "shape", "shape": "rounded_rectangle", "x": 2.9, "y": 1.8, "w": 2.2, "h": 1.4, "fill": "D4A438"},
        {"type": "text", "text": "Or Royal\n#D4A438", "x": 2.9, "y": 2, "w": 2.2, "h": 0.8, "font_size": 11, "color": "0D2240", "align": "center"},
        {"type": "shape", "shape": "rounded_rectangle", "x": 5.3, "y": 1.8, "w": 2.2, "h": 1.4, "fill": "0D2240"},
        {"type": "text", "text": "Marine Profond\n#0D2240", "x": 5.3, "y": 2, "w": 2.2, "h": 0.8, "font_size": 11, "color": "FFFFFF", "align": "center"},
        {"type": "shape", "shape": "rounded_rectangle", "x": 7.7, "y": 1.8, "w": 2.2, "h": 1.4, "fill": "F0C75E"},
        {"type": "text", "text": "Or Clair\n#F0C75E", "x": 7.7, "y": 2, "w": 2.2, "h": 0.8, "font_size": 11, "color": "0D2240", "align": "center"},
        {"type": "shape", "shape": "rounded_rectangle", "x": 10.1, "y": 1.8, "w": 2.2, "h": 1.4, "fill": "0E1B30"},
        {"type": "text", "text": "Nuit\n#0E1B30", "x": 10.1, "y": 2, "w": 2.2, "h": 0.8, "font_size": 11, "color": "FFFFFF", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 0.3, "y": 3.5, "w": 6.2, "h": 3.5, "fill": "0E1B30"},
        {"type": "text", "text": "TYPOGRAPHIES", "x": 0.6, "y": 3.7, "w": 3, "h": 0.4, "font_size": 14, "color": "D4A438", "bold": True},
        {"type": "text", "text": "Titres principaux\nGeorgia Bold - Serif elegant et intemporel\nEvoque la sagesse, la tradition et l'autorite\n\nCorps de texte\nInter / Calibri - Sans-serif moderne\nLisibilite optimale sur ecran\n\nAccents & citations\nGeorgia Italic - Pour les messages inspirants\nEffet premium et raffine", "x": 0.6, "y": 4.15, "w": 5.6, "h": 2.6, "font_size": 11, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 6.8, "y": 3.5, "w": 6.2, "h": 3.5, "fill": "0E1B30"},
        {"type": "text", "text": "PRINCIPES DE DESIGN", "x": 7.1, "y": 3.7, "w": 3, "h": 0.4, "font_size": 14, "color": "D4A438", "bold": True},
        {"type": "text", "text": "- Design professionnel, sobre et inspirant\n- Interface claire et intuitive (UX premium)\n- Integration citations & messages inspirants\n- Responsive design mobile-first\n- Accessibilite WCAG 2.1 AA\n- Animations subtiles (Framer Motion)\n- Micro-interactions engageantes\n- Hierarchie visuelle forte\n- Espacement genereux (breathing room)\n- Dark mode optionnel", "x": 7.1, "y": 4.15, "w": 5.6, "h": 2.6, "font_size": 11, "color": "B0B8C0"},

        {"type": "image", "path": logo, "x": 10.5, "y": 0.2, "w": 2.3, "h": 1.2},
    ]
})

# ============================================================
# SLIDE 12 - STACK TECHNIQUE
# ============================================================
slides.append({
    "background_image": bg1,
    "elements": [
        {"type": "shape", "shape": "rectangle", "x": 0, "y": 0, "w": 0.08, "h": H, "fill": "D4A438"},
        {"type": "text", "text": "10  TECHNOLOGIES & STACK TECHNIQUE", "x": 0.4, "y": 0.2, "w": 12, "h": 0.7, "font_size": 26, "color": "FFFFFF", "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 0.4, "y": 0.85, "w": 4, "h": 0.04, "fill": "D4A438"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 0.2, "y": 1.2, "w": 4.2, "h": 2.7, "fill": "142842"},
        {"type": "text", "text": "FRONTEND", "x": 0.5, "y": 1.35, "w": 2, "h": 0.35, "font_size": 15, "color": "D4A438", "bold": True},
        {"type": "text", "text": "Next.js 14+ (React 18)\nTypeScript strict mode\nTailwind CSS + Headless UI\nFramer Motion (animations)\nPWA Ready (offline support)\nReact Query (state server)", "x": 0.5, "y": 1.8, "w": 3.6, "h": 1.8, "font_size": 11, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 4.6, "y": 1.2, "w": 4.2, "h": 2.7, "fill": "142842"},
        {"type": "text", "text": "BACKEND", "x": 4.9, "y": 1.35, "w": 2, "h": 0.35, "font_size": 15, "color": "D4A438", "bold": True},
        {"type": "text", "text": "Node.js / NestJS (TypeScript)\nPostgreSQL 16 + Redis 7\nPrisma ORM (type-safe)\nAPI REST & GraphQL\nWebSocket (Socket.io)\nBull MQ (jobs asynchrones)", "x": 4.9, "y": 1.8, "w": 3.6, "h": 1.8, "font_size": 11, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 9, "y": 1.2, "w": 4.1, "h": 2.7, "fill": "142842"},
        {"type": "text", "text": "INFRASTRUCTURE", "x": 9.3, "y": 1.35, "w": 3, "h": 0.35, "font_size": 15, "color": "D4A438", "bold": True},
        {"type": "text", "text": "AWS (EC2, RDS, S3, CloudFront)\nDocker + GitHub Actions CI/CD\nCloudflare CDN & WAF\nTerraform (IaC)\nDatadog monitoring 24/7\nAutomatic scaling", "x": 9.3, "y": 1.8, "w": 3.6, "h": 1.8, "font_size": 11, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 0.2, "y": 4.1, "w": 4.2, "h": 2.9, "fill": "142842"},
        {"type": "text", "text": "PAIEMENTS", "x": 0.5, "y": 4.25, "w": 2, "h": 0.35, "font_size": 15, "color": "D4A438", "bold": True},
        {"type": "text", "text": "Stripe (Carte bancaire, abo)\nPayPal Business API\nMobile Money (MTN, Orange, Airtel)\nFlutterwave (Afrique)\nFacturation auto PDF\nWebhooks securises\nCodes promo & coupons", "x": 0.5, "y": 4.7, "w": 3.6, "h": 2, "font_size": 11, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 4.6, "y": 4.1, "w": 4.2, "h": 2.9, "fill": "142842"},
        {"type": "text", "text": "VIDEO & STREAMING", "x": 4.9, "y": 4.25, "w": 3, "h": 0.35, "font_size": 15, "color": "D4A438", "bold": True},
        {"type": "text", "text": "Mux / Cloudflare Stream\nHLS adaptive bitrate streaming\nProtection DRM du contenu\nZoom SDK integration (live)\nTranscodage automatique multi-qualite\nSous-titres auto (Whisper AI)\nLecteur video custom branded", "x": 4.9, "y": 4.7, "w": 3.6, "h": 2, "font_size": 11, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 9, "y": 4.1, "w": 4.1, "h": 2.9, "fill": "142842"},
        {"type": "text", "text": "EMAILS & NOTIFICATIONS", "x": 9.3, "y": 4.25, "w": 3, "h": 0.35, "font_size": 15, "color": "D4A438", "bold": True},
        {"type": "text", "text": "Resend / SendGrid (transactional)\nPush notifications (OneSignal)\nSMS via Twilio\nEmails marketing (Mailchimp)\nTemplates HTML personnalises\nAutomation workflows\nRappels intelligents", "x": 9.3, "y": 4.7, "w": 3.6, "h": 2, "font_size": 11, "color": "B0B8C0"},
    ]
})

# ============================================================
# SLIDE 13 - SEO & REFERENCEMENT
# ============================================================
slides.append({
    "background_image": bg6,
    "elements": [
        {"type": "image", "path": gold_line, "x": 0, "y": 0, "w": W, "h": 0.06},
        {"type": "shape", "shape": "rectangle", "x": 0, "y": H-0.06, "w": W, "h": 0.06, "fill": "D4A438"},
        {"type": "text", "text": "11  SEO & REFERENCEMENT", "x": 0.5, "y": 0.2, "w": 12, "h": 0.7, "font_size": 26, "color": "FFFFFF", "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 0.5, "y": 0.85, "w": 4, "h": 0.04, "fill": "D4A438"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 0.3, "y": 1.2, "w": 4.1, "h": 5.8, "fill": "0E1B30"},
        {"type": "text", "text": "SEO TECHNIQUE", "x": 0.6, "y": 1.4, "w": 3, "h": 0.4, "font_size": 15, "color": "D4A438", "bold": True},
        {"type": "text", "text": "- Server-Side Rendering (SSR)\n- Static Site Generation (SSG)\n- Sitemap XML automatique\n- Robots.txt optimise\n- Schema.org (Course, Organization)\n- URLs propres & semantiques\n- Meta tags dynamiques\n- Canonical URLs\n- Temps de chargement < 2s\n- Core Web Vitals optimises\n- Compression images WebP\n- Lazy loading natif", "x": 0.6, "y": 1.9, "w": 3.5, "h": 4.8, "font_size": 11, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 4.6, "y": 1.2, "w": 4.1, "h": 5.8, "fill": "0E1B30"},
        {"type": "text", "text": "SEO CONTENU", "x": 4.9, "y": 1.4, "w": 3, "h": 0.4, "font_size": 15, "color": "D4A438", "bold": True},
        {"type": "text", "text": "- Blog integre (articles SEO)\n- Mots-cles cibles par page\n- Contenu riche & structure (H1-H6)\n- Alt text sur toutes les images\n- Internal linking strategique\n- Pages de formation optimisees\n- FAQ structurees (rich snippets)\n- Temoignages indexes\n- Contenu multilingue (FR/EN)\n- Actualisation reguliere\n- Long-tail keywords\n- Content hub par thematique", "x": 4.9, "y": 1.9, "w": 3.5, "h": 4.8, "font_size": 11, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 8.9, "y": 1.2, "w": 4.1, "h": 5.8, "fill": "0E1B30"},
        {"type": "text", "text": "MARKETING DIGITAL", "x": 9.2, "y": 1.4, "w": 3, "h": 0.4, "font_size": 15, "color": "D4A438", "bold": True},
        {"type": "text", "text": "- Google Analytics 4 integre\n- Google Search Console\n- Open Graph (Facebook/LinkedIn)\n- Twitter Cards\n- Pixel Facebook & tracking\n- Google Tag Manager\n- Email marketing automation\n- Landing pages optimisees\n- A/B testing integre\n- Suivi conversions\n- Retargeting audiences\n- Performance ads ready", "x": 9.2, "y": 1.9, "w": 3.5, "h": 4.8, "font_size": 11, "color": "B0B8C0"},
    ]
})

# ============================================================
# SLIDE 14 - PARCOURS UTILISATEUR (UX)
# ============================================================
slides.append({
    "background_image": bg8,
    "elements": [
        {"type": "shape", "shape": "rectangle", "x": 0, "y": 0, "w": 0.08, "h": H, "fill": "D4A438"},
        {"type": "text", "text": "12", "x": 0.4, "y": 0.2, "w": 1.5, "h": 0.7, "font_size": 48, "color": "D4A438", "bold": True, "font": "Georgia"},
        {"type": "text", "text": "PARCOURS UTILISATEUR (UX)", "x": 2, "y": 0.3, "w": 10, "h": 0.7, "font_size": 26, "color": "FFFFFF", "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 2, "y": 0.95, "w": 4, "h": 0.04, "fill": "D4A438"},

        # Step 1
        {"type": "shape", "shape": "rounded_rectangle", "x": 0.2, "y": 1.3, "w": 2.4, "h": 2.5, "fill": "0E1B30"},
        {"type": "shape", "shape": "oval", "x": 1, "y": 1.45, "w": 0.7, "h": 0.7, "fill": "D4A438"},
        {"type": "text", "text": "1", "x": 1, "y": 1.5, "w": 0.7, "h": 0.5, "font_size": 20, "color": "0D2240", "bold": True, "align": "center"},
        {"type": "text", "text": "DECOUVERTE", "x": 0.3, "y": 2.2, "w": 2.2, "h": 0.35, "font_size": 11, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "Page d'accueil, video inspirante, apercu formations", "x": 0.3, "y": 2.6, "w": 2.2, "h": 0.9, "font_size": 10, "color": "A0A8B0", "align": "center"},

        # Step 2
        {"type": "shape", "shape": "rounded_rectangle", "x": 2.8, "y": 1.3, "w": 2.4, "h": 2.5, "fill": "0E1B30"},
        {"type": "shape", "shape": "oval", "x": 3.6, "y": 1.45, "w": 0.7, "h": 0.7, "fill": "D4A438"},
        {"type": "text", "text": "2", "x": 3.6, "y": 1.5, "w": 0.7, "h": 0.5, "font_size": 20, "color": "0D2240", "bold": True, "align": "center"},
        {"type": "text", "text": "INSCRIPTION", "x": 2.9, "y": 2.2, "w": 2.2, "h": 0.35, "font_size": 11, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "Formulaire simple, email ou Google/Facebook SSO", "x": 2.9, "y": 2.6, "w": 2.2, "h": 0.9, "font_size": 10, "color": "A0A8B0", "align": "center"},

        # Step 3
        {"type": "shape", "shape": "rounded_rectangle", "x": 5.4, "y": 1.3, "w": 2.4, "h": 2.5, "fill": "0E1B30"},
        {"type": "shape", "shape": "oval", "x": 6.2, "y": 1.45, "w": 0.7, "h": 0.7, "fill": "D4A438"},
        {"type": "text", "text": "3", "x": 6.2, "y": 1.5, "w": 0.7, "h": 0.5, "font_size": 20, "color": "0D2240", "bold": True, "align": "center"},
        {"type": "text", "text": "EXPLORATION", "x": 5.5, "y": 2.2, "w": 2.2, "h": 0.35, "font_size": 11, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "Catalogue, filtres, fiches detaillees, avis", "x": 5.5, "y": 2.6, "w": 2.2, "h": 0.9, "font_size": 10, "color": "A0A8B0", "align": "center"},

        # Step 4
        {"type": "shape", "shape": "rounded_rectangle", "x": 8, "y": 1.3, "w": 2.4, "h": 2.5, "fill": "0E1B30"},
        {"type": "shape", "shape": "oval", "x": 8.8, "y": 1.45, "w": 0.7, "h": 0.7, "fill": "D4A438"},
        {"type": "text", "text": "4", "x": 8.8, "y": 1.5, "w": 0.7, "h": 0.5, "font_size": 20, "color": "0D2240", "bold": True, "align": "center"},
        {"type": "text", "text": "PAIEMENT", "x": 8.1, "y": 2.2, "w": 2.2, "h": 0.35, "font_size": 11, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "Checkout securise, multi-options, confirmation", "x": 8.1, "y": 2.6, "w": 2.2, "h": 0.9, "font_size": 10, "color": "A0A8B0", "align": "center"},

        # Step 5
        {"type": "shape", "shape": "rounded_rectangle", "x": 10.6, "y": 1.3, "w": 2.4, "h": 2.5, "fill": "0E1B30"},
        {"type": "shape", "shape": "oval", "x": 11.4, "y": 1.45, "w": 0.7, "h": 0.7, "fill": "D4A438"},
        {"type": "text", "text": "5", "x": 11.4, "y": 1.5, "w": 0.7, "h": 0.5, "font_size": 20, "color": "0D2240", "bold": True, "align": "center"},
        {"type": "text", "text": "APPRENTISSAGE", "x": 10.7, "y": 2.2, "w": 2.2, "h": 0.35, "font_size": 11, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "Videos, quiz, defis, coaching live", "x": 10.7, "y": 2.6, "w": 2.2, "h": 0.9, "font_size": 10, "color": "A0A8B0", "align": "center"},

        # Row 2 - Steps 6-8
        {"type": "shape", "shape": "rounded_rectangle", "x": 0.2, "y": 4.1, "w": 4.1, "h": 2.9, "fill": "0E1B30"},
        {"type": "shape", "shape": "oval", "x": 1.8, "y": 4.3, "w": 0.7, "h": 0.7, "fill": "D4A438"},
        {"type": "text", "text": "6", "x": 1.8, "y": 4.35, "w": 0.7, "h": 0.5, "font_size": 20, "color": "0D2240", "bold": True, "align": "center"},
        {"type": "text", "text": "PROGRESSION & SUIVI", "x": 0.3, "y": 5.1, "w": 3.8, "h": 0.35, "font_size": 13, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "Dashboard personnel, barre de progression, badges gamifies, historique complet, rappels automatiques", "x": 0.4, "y": 5.5, "w": 3.6, "h": 1.2, "font_size": 11, "color": "A0A8B0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 4.6, "y": 4.1, "w": 4.1, "h": 2.9, "fill": "0E1B30"},
        {"type": "shape", "shape": "oval", "x": 6.2, "y": 4.3, "w": 0.7, "h": 0.7, "fill": "D4A438"},
        {"type": "text", "text": "7", "x": 6.2, "y": 4.35, "w": 0.7, "h": 0.5, "font_size": 20, "color": "0D2240", "bold": True, "align": "center"},
        {"type": "text", "text": "CERTIFICATION", "x": 4.7, "y": 5.1, "w": 3.8, "h": 0.35, "font_size": 13, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "Certificat PDF automatique avec QR code de verification, partage sur LinkedIn & reseaux sociaux", "x": 4.8, "y": 5.5, "w": 3.6, "h": 1.2, "font_size": 11, "color": "A0A8B0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 8.9, "y": 4.1, "w": 4.1, "h": 2.9, "fill": "0E1B30"},
        {"type": "shape", "shape": "oval", "x": 10.5, "y": 4.3, "w": 0.7, "h": 0.7, "fill": "D4A438"},
        {"type": "text", "text": "8", "x": 10.5, "y": 4.35, "w": 0.7, "h": 0.5, "font_size": 20, "color": "0D2240", "bold": True, "align": "center"},
        {"type": "text", "text": "COMMUNAUTE & IMPACT", "x": 9, "y": 5.1, "w": 3.8, "h": 0.35, "font_size": 13, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "text", "text": "Forum, temoignages, defis collectifs, affiliation, ambassadeurs de la vision", "x": 9.1, "y": 5.5, "w": 3.6, "h": 1.2, "font_size": 11, "color": "A0A8B0", "align": "center"},
    ]
})

# ============================================================
# SLIDE 15 - EVOLUTIONS FUTURES
# ============================================================
slides.append({
    "background_image": bg4,
    "elements": [
        {"type": "image", "path": gold_line, "x": 0, "y": 0, "w": W, "h": 0.06},
        {"type": "shape", "shape": "rectangle", "x": 0, "y": H-0.06, "w": W, "h": 0.06, "fill": "D4A438"},
        {"type": "text", "text": "13  EVOLUTIONS FUTURES & ROADMAP", "x": 0.5, "y": 0.2, "w": 12, "h": 0.7, "font_size": 26, "color": "FFFFFF", "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 0.5, "y": 0.85, "w": 4, "h": 0.04, "fill": "D4A438"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 0.2, "y": 1.2, "w": 3.1, "h": 5.8, "fill": "0C1526"},
        {"type": "text", "text": "PHASE 1\nMVP", "x": 0.4, "y": 1.4, "w": 2.7, "h": 0.8, "font_size": 18, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "shape", "shape": "rectangle", "x": 0.8, "y": 2.3, "w": 1.5, "h": 0.04, "fill": "D4A438"},
        {"type": "text", "text": "Site web complet\nEspace membre\nPaiement en ligne\nCours enregistres\nDashboard admin\nSysteme de notation\nCertificats PDF\nBlog SEO", "x": 0.4, "y": 2.6, "w": 2.7, "h": 4, "font_size": 11, "color": "B0B8C0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 3.5, "y": 1.2, "w": 3.1, "h": 5.8, "fill": "0C1526"},
        {"type": "text", "text": "PHASE 2\nENRICHISSEMENT", "x": 3.7, "y": 1.4, "w": 2.7, "h": 0.8, "font_size": 18, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "shape", "shape": "rectangle", "x": 4.1, "y": 2.3, "w": 1.5, "h": 0.04, "fill": "D4A438"},
        {"type": "text", "text": "Sessions live Zoom\nForum communautaire\nNotifications avancees\nCalendrier events\nGamification (badges)\nParcours personnalise\nCoaching de groupe\nMulti-langue FR/EN", "x": 3.7, "y": 2.6, "w": 2.7, "h": 4, "font_size": 11, "color": "B0B8C0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 6.8, "y": 1.2, "w": 3.1, "h": 5.8, "fill": "0C1526"},
        {"type": "text", "text": "PHASE 3\nEXPANSION", "x": 7, "y": 1.4, "w": 2.7, "h": 0.8, "font_size": 18, "color": "D4A438", "bold": True, "align": "center"},
        {"type": "shape", "shape": "rectangle", "x": 7.4, "y": 2.3, "w": 1.5, "h": 0.04, "fill": "D4A438"},
        {"type": "text", "text": "App mobile iOS/Android\nProgramme mentorat\nSysteme d'affiliation\nIA recommandations\nSous-titres auto (AI)\nMarketplace formateurs\nPodcast integre\nEvenements physiques", "x": 7, "y": 2.6, "w": 2.7, "h": 4, "font_size": 11, "color": "B0B8C0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 10.1, "y": 1.2, "w": 3, "h": 5.8, "fill": "D4A438"},
        {"type": "text", "text": "VISION\nULTIME", "x": 10.3, "y": 1.4, "w": 2.6, "h": 0.8, "font_size": 18, "color": "0D2240", "bold": True, "align": "center"},
        {"type": "shape", "shape": "rectangle", "x": 10.7, "y": 2.3, "w": 1.5, "h": 0.04, "fill": "0D2240"},
        {"type": "text", "text": "Reference francophone\nFormation spirituelle\nEcosysteme complet\nImpact mondial\nCommunaute globale\nLeaders formes\nTransformation durable\nHeritage spirituel", "x": 10.3, "y": 2.6, "w": 2.6, "h": 4, "font_size": 11, "color": "1A2D50", "align": "center"},
    ]
})

# ============================================================
# SLIDE 16 - POURQUOI NOUS CHOISIR
# ============================================================
slides.append({
    "background_image": bg7,
    "elements": [
        {"type": "shape", "shape": "rectangle", "x": 0, "y": 0, "w": 0.08, "h": H, "fill": "D4A438"},
        {"type": "text", "text": "14", "x": 0.4, "y": 0.2, "w": 1.5, "h": 0.7, "font_size": 48, "color": "D4A438", "bold": True, "font": "Georgia"},
        {"type": "text", "text": "POURQUOI NOUS CHOISIR ?", "x": 2, "y": 0.3, "w": 10, "h": 0.7, "font_size": 26, "color": "FFFFFF", "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 2, "y": 0.95, "w": 4, "h": 0.04, "fill": "D4A438"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 0.3, "y": 1.3, "w": 6.2, "h": 2.5, "fill": "0E1B30"},
        {"type": "image", "path": ic["rocket"], "x": 0.6, "y": 1.5, "w": 0.5, "h": 0.5},
        {"type": "text", "text": "EXPERTISE TECHNIQUE PROUVEE", "x": 1.2, "y": 1.5, "w": 5, "h": 0.4, "font_size": 14, "color": "D4A438", "bold": True},
        {"type": "text", "text": "Technologies de pointe (Next.js, NestJS, AWS), architecture scalable, code propre et maintenable. Nous avons deja livre des plateformes complexes pour des clients exigeants comme Messiya Group.", "x": 0.6, "y": 2.1, "w": 5.6, "h": 1.5, "font_size": 12, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 6.8, "y": 1.3, "w": 6.2, "h": 2.5, "fill": "0E1B30"},
        {"type": "image", "path": ic["shield"], "x": 7.1, "y": 1.5, "w": 0.5, "h": 0.5},
        {"type": "text", "text": "SECURITE SANS COMPROMIS", "x": 7.7, "y": 1.5, "w": 5, "h": 0.4, "font_size": 14, "color": "D4A438", "bold": True},
        {"type": "text", "text": "Normes de securite bancaire : SSL, 2FA, chiffrement AES-256, PCI-DSS, RGPD. Audits reguliers, monitoring 24/7, protection DDoS. Vos donnees et celles de vos apprenants sont sacrees.", "x": 7.1, "y": 2.1, "w": 5.6, "h": 1.5, "font_size": 12, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 0.3, "y": 4.0, "w": 6.2, "h": 2.5, "fill": "0E1B30"},
        {"type": "image", "path": ic["heart"], "x": 0.6, "y": 4.2, "w": 0.5, "h": 0.5},
        {"type": "text", "text": "DESIGN HORS DU COMMUN", "x": 1.2, "y": 4.2, "w": 5, "h": 0.4, "font_size": 14, "color": "D4A438", "bold": True},
        {"type": "text", "text": "Un design premium qui reflete l'excellence de la vision de Lord Lombo. Charte graphique sur mesure (Bleu Royal & Or), animations fluides, UX intuitive. Une experience qui inspire des la premiere visite.", "x": 0.6, "y": 4.8, "w": 5.6, "h": 1.5, "font_size": 12, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 6.8, "y": 4.0, "w": 6.2, "h": 2.5, "fill": "0E1B30"},
        {"type": "image", "path": ic["globe"], "x": 7.1, "y": 4.2, "w": 0.5, "h": 0.5},
        {"type": "text", "text": "ACCOMPAGNEMENT TOTAL", "x": 7.7, "y": 4.2, "w": 5, "h": 0.4, "font_size": 14, "color": "D4A438", "bold": True},
        {"type": "text", "text": "De la conception au deploiement, maintenance et evolutions incluses. Support reactif, formation a l'administration, documentation complete. Votre succes est notre priorite absolue.", "x": 7.1, "y": 4.8, "w": 5.6, "h": 1.5, "font_size": 12, "color": "B0B8C0"},

        {"type": "shape", "shape": "rectangle", "x": 0.3, "y": 6.8, "w": 12.7, "h": 0.04, "fill": "D4A438"},
        {"type": "text", "text": "Nous ne livrons pas un site web. Nous construisons un ecosysteme de transformation.", "x": 1, "y": 6.9, "w": 11.3, "h": 0.4, "font_size": 13, "color": "D4A438", "align": "center", "font": "Georgia"},
    ]
})

# ============================================================
# SLIDE 17 - CONCLUSION / MERCI
# ============================================================
slides.append({
    "background_image": bg1,
    "elements": [
        {"type": "shape", "shape": "rectangle", "x": 0, "y": 0, "w": 0.08, "h": H, "fill": "D4A438"},
        {"type": "shape", "shape": "rectangle", "x": W-0.08, "y": 0, "w": 0.08, "h": H, "fill": "D4A438"},
        {"type": "image", "path": logo, "x": 4.5, "y": 0.3, "w": 4.3, "h": 3.1},
        {"type": "shape", "shape": "rectangle", "x": 1.5, "y": 3.5, "w": 10.3, "h": 0.06, "fill": "D4A438"},
        {"type": "text", "text": "LORD LOMBO ACADEMIE", "x": 0.5, "y": 3.8, "w": 12.3, "h": 0.9, "font_size": 40, "color": "D4A438", "bold": True, "align": "center", "font": "Georgia"},
        {"type": "text", "text": "Transformation  -  Leadership  -  Impact", "x": 2, "y": 4.7, "w": 9.3, "h": 0.5, "font_size": 18, "color": "CADCFC", "align": "center", "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 5.5, "y": 5.4, "w": 2.3, "h": 0.04, "fill": "D4A438"},
        {"type": "text", "text": "Prets a batir ensemble une plateforme d'excellence\nqui transformera des vies et formera les leaders de demain.", "x": 1.5, "y": 5.6, "w": 10.3, "h": 0.8, "font_size": 15, "color": "A0B0C0", "align": "center"},
        {"type": "text", "text": "MERCI POUR VOTRE CONFIANCE", "x": 2, "y": 6.6, "w": 9.3, "h": 0.5, "font_size": 16, "color": "D4A438", "align": "center", "bold": True},
        {"type": "shape", "shape": "rectangle", "x": 0, "y": H-0.06, "w": W, "h": 0.06, "fill": "D4A438"},
    ]
})

spec = {"width": W, "height": H, "slides": slides}
spec_path = os.path.join(BASE, "spec_v2.json")
with open(spec_path, "w") as f:
    json.dump(spec, f, indent=2)
print(f"V2 Spec generated: {len(slides)} slides at {spec_path}")
