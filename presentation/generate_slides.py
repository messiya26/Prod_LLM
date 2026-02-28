import json
import os
from PIL import Image, ImageDraw, ImageFont

BASE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(os.path.dirname(BASE), "assets")

NAVY = "#0D2240"
GOLD = "#D4A438"
GOLD_LIGHT = "#F0C75E"
WHITE = "#FFFFFF"
DARK_BG = "#0A1628"
LIGHT_BG = "#F8F6F0"
CREAM = "#FFF8E7"
GRAY = "#5A5A5A"
BLUE_ROYAL = "#1B3A6B"

W = 13.333
H = 7.5

def make_gradient_image(filename, w_px, h_px, color1, color2, direction="vertical"):
    img = Image.new("RGB", (w_px, h_px))
    draw = ImageDraw.Draw(img)
    r1, g1, b1 = int(color1[1:3],16), int(color1[3:5],16), int(color1[5:7],16)
    r2, g2, b2 = int(color2[1:3],16), int(color2[3:5],16), int(color2[5:7],16)
    for i in range(h_px if direction == "vertical" else w_px):
        ratio = i / (h_px if direction == "vertical" else w_px)
        r = int(r1 + (r2 - r1) * ratio)
        g = int(g1 + (g2 - g1) * ratio)
        b = int(b1 + (b2 - b1) * ratio)
        if direction == "vertical":
            draw.line([(0, i), (w_px, i)], fill=(r, g, b))
        else:
            draw.line([(i, 0), (i, h_px)], fill=(r, g, b))
    path = os.path.join(BASE, filename)
    img.save(path)
    return path

def make_icon_circle(filename, text, bg_color, text_color="#FFFFFF", size=120):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.ellipse([4, 4, size-4, size-4], fill=bg_color)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", size // 3)
    except:
        font = ImageFont.load_default()
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((size - tw) // 2, (size - th) // 2 - 5), text, fill=text_color, font=font)
    path = os.path.join(BASE, filename)
    img.save(path)
    return path

def make_decorative_bar(filename, w_px=1920, h_px=8, color=GOLD):
    img = Image.new("RGB", (w_px, h_px), color)
    path = os.path.join(BASE, filename)
    img.save(path)
    return path

# Generate assets
bg_dark = make_gradient_image("bg_dark.png", 1920, 1080, DARK_BG, NAVY)
bg_light = make_gradient_image("bg_light.png", 1920, 1080, "#FFFFFF", CREAM)
bg_section = make_gradient_image("bg_section.png", 1920, 1080, BLUE_ROYAL, DARK_BG)
gold_bar = make_decorative_bar("gold_bar.png")
gold_bar_v = make_decorative_bar("gold_bar_v.png", 8, 1080, GOLD)

icons = {}
icon_labels = {
    "spiritual": "S", "leadership": "L", "dev": "D",
    "video": "V", "live": "Z", "coaching": "C",
    "cert": "C", "forum": "F", "calendar": "E",
    "mobile": "M", "pay": "P", "secure": "S",
    "star": "5", "admin": "A", "notif": "N",
}
for name, letter in icon_labels.items():
    color = GOLD if name in ["spiritual","video","cert","mobile","pay","star"] else BLUE_ROYAL
    icons[name] = make_icon_circle(f"icon_{name}.png", letter, color)

logo_path = os.path.join(ASSETS, "logo-client.jpeg")

slides = []

# SLIDE 1: Title
slides.append({
    "background_image": bg_dark,
    "elements": [
        {"type": "shape", "shape": "rectangle", "x": 0, "y": 3.2, "w": W, "h": 0.06, "fill": GOLD[1:]},
        {"type": "image", "path": logo_path, "x": 4.8, "y": 0.4, "w": 3.7, "h": 2.7},
        {"type": "text", "text": "LORD LOMBO ACADEMIE", "x": 0.5, "y": 3.5, "w": 12.3, "h": 1,
         "font_size": 42, "color": GOLD[1:], "bold": True, "align": "center", "font": "Georgia"},
        {"type": "text", "text": "Plateforme de Formation Spirituelle, Leadership & Developpement Personnel",
         "x": 1.5, "y": 4.5, "w": 10.3, "h": 0.8, "font_size": 18, "color": "CADCFC", "align": "center", "font": "Georgia"},
        {"type": "text", "text": "Proposition Technique & Comprehension des Besoins",
         "x": 2, "y": 5.5, "w": 9.3, "h": 0.6, "font_size": 14, "color": "8899AA", "align": "center"},
        {"type": "text", "text": "Document Confidentiel  |  Fevrier 2026",
         "x": 2, "y": 6.3, "w": 9.3, "h": 0.5, "font_size": 11, "color": "667788", "align": "center"},
    ]
})

# SLIDE 2: Sommaire
slides.append({
    "background_image": bg_light,
    "elements": [
        {"type": "image", "path": gold_bar, "x": 0, "y": 0, "w": W, "h": 0.06},
        {"type": "text", "text": "SOMMAIRE", "x": 0.8, "y": 0.4, "w": 5, "h": 0.8,
         "font_size": 32, "color": BLUE_ROYAL[1:], "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 0.8, "y": 1.1, "w": 2, "h": 0.05, "fill": GOLD[1:]},
        {"type": "text", "text": "01.  Comprehension du Besoin\n\n02.  Vision & Objectifs Strategiques\n\n03.  Architecture de la Plateforme\n\n04.  Modules Fonctionnels\n\n05.  Methodes Pedagogiques\n\n06.  Fonctionnalites Avancees\n\n07.  Securite & Performance\n\n08.  Identite Visuelle & Design\n\n09.  Technologies & Stack Technique\n\n10.  Evolutions Futures & Roadmap",
         "x": 1.2, "y": 1.6, "w": 7, "h": 5.5, "font_size": 16, "color": NAVY[1:], "font": "Calibri"},
        {"type": "image", "path": logo_path, "x": 9.5, "y": 2, "w": 3, "h": 2.2},
    ]
})

# SLIDE 3: Comprehension du besoin
slides.append({
    "background_image": bg_dark,
    "elements": [
        {"type": "shape", "shape": "rectangle", "x": 0, "y": 0, "w": 0.06, "h": H, "fill": GOLD[1:]},
        {"type": "text", "text": "01", "x": 0.4, "y": 0.3, "w": 1.5, "h": 1,
         "font_size": 60, "color": GOLD[1:], "bold": True, "font": "Georgia"},
        {"type": "text", "text": "COMPREHENSION\nDU BESOIN", "x": 0.4, "y": 1.2, "w": 5, "h": 1.4,
         "font_size": 30, "color": "FFFFFF", "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 0.4, "y": 2.7, "w": 3, "h": 0.04, "fill": GOLD[1:]},
        {"type": "text", "text": "Lord Lombo Academie est un projet de plateforme e-learning premium dediee a la transformation spirituelle, au leadership chretien et au developpement personnel.\n\nElle s'adresse a des individus en quete de croissance interieure, desireux de renforcer leur influence en tant que leaders et d'impacter positivement leur environnement.\n\nLa plateforme combinera formations video, coaching en direct, parcours personnalises et un systeme de suivi de progression complet.",
         "x": 0.4, "y": 3.0, "w": 5.8, "h": 4, "font_size": 13, "color": "C0C8D0"},
        {"type": "shape", "shape": "rounded_rectangle", "x": 7, "y": 1, "w": 5.5, "h": 5.2, "fill": "1A2D50", "line": GOLD[1:]},
        {"type": "text", "text": "BESOINS IDENTIFIES", "x": 7.4, "y": 1.3, "w": 4.7, "h": 0.6,
         "font_size": 16, "color": GOLD[1:], "bold": True},
        {"type": "text", "text": "  Plateforme d'apprentissage moderne\n  et inspirante\n\n  Formations spirituelles & leadership\n  accessibles en ligne\n\n  Systeme d'inscription, paiement &\n  suivi securise\n\n  Mesure de satisfaction & impact\n\n  Communaute engagee autour de la\n  vision de Lord Lombo",
         "x": 7.4, "y": 2.0, "w": 4.7, "h": 4, "font_size": 12, "color": "E0E0E0"},
    ]
})

# SLIDE 4: Vision & Objectifs
slides.append({
    "background_image": bg_light,
    "elements": [
        {"type": "image", "path": gold_bar, "x": 0, "y": 0, "w": W, "h": 0.06},
        {"type": "text", "text": "02  VISION & OBJECTIFS STRATEGIQUES", "x": 0.8, "y": 0.3, "w": 11, "h": 0.8,
         "font_size": 28, "color": BLUE_ROYAL[1:], "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 0.8, "y": 1.0, "w": 2.5, "h": 0.05, "fill": GOLD[1:]},

        {"type": "shape", "shape": "rounded_rectangle", "x": 0.5, "y": 1.5, "w": 3.8, "h": 2.5, "fill": NAVY[1:]},
        {"type": "text", "text": "FORMER", "x": 0.7, "y": 1.7, "w": 3.4, "h": 0.5,
         "font_size": 20, "color": GOLD[1:], "bold": True, "align": "center"},
        {"type": "text", "text": "Offrir des parcours de formation structurees et certifiantes en croissance spirituelle et leadership",
         "x": 0.8, "y": 2.3, "w": 3.2, "h": 1.5, "font_size": 12, "color": "C0C8D0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 4.7, "y": 1.5, "w": 3.8, "h": 2.5, "fill": NAVY[1:]},
        {"type": "text", "text": "TRANSFORMER", "x": 4.9, "y": 1.7, "w": 3.4, "h": 0.5,
         "font_size": 20, "color": GOLD[1:], "bold": True, "align": "center"},
        {"type": "text", "text": "Accompagner chaque apprenant dans une transformation profonde et durable a travers un suivi personnalise",
         "x": 5, "y": 2.3, "w": 3.2, "h": 1.5, "font_size": 12, "color": "C0C8D0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 8.9, "y": 1.5, "w": 3.8, "h": 2.5, "fill": NAVY[1:]},
        {"type": "text", "text": "IMPACTER", "x": 9.1, "y": 1.7, "w": 3.4, "h": 0.5,
         "font_size": 20, "color": GOLD[1:], "bold": True, "align": "center"},
        {"type": "text", "text": "Creer une communaute de leaders influents qui impactent positivement leur environnement",
         "x": 9.2, "y": 2.3, "w": 3.2, "h": 1.5, "font_size": 12, "color": "C0C8D0", "align": "center"},

        {"type": "text", "text": "\"Devenir une reference dans l'espace francophone pour la formation spirituelle, le leadership et le developpement personnel.\"",
         "x": 1.5, "y": 4.5, "w": 10, "h": 1.2, "font_size": 18, "color": BLUE_ROYAL[1:], "align": "center", "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 5.5, "y": 5.8, "w": 2.3, "h": 0.04, "fill": GOLD[1:]},
        {"type": "text", "text": "Lord Lombo Academie", "x": 4, "y": 6, "w": 5.3, "h": 0.5,
         "font_size": 13, "color": GRAY[1:], "align": "center", "font": "Georgia"},
    ]
})

# SLIDE 5: Architecture de la plateforme
slides.append({
    "background_image": bg_dark,
    "elements": [
        {"type": "shape", "shape": "rectangle", "x": 0, "y": 0, "w": 0.06, "h": H, "fill": GOLD[1:]},
        {"type": "text", "text": "03  ARCHITECTURE DE LA PLATEFORME", "x": 0.4, "y": 0.3, "w": 12, "h": 0.8,
         "font_size": 28, "color": "FFFFFF", "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 0.4, "y": 1.0, "w": 3, "h": 0.04, "fill": GOLD[1:]},

        # Page d'accueil
        {"type": "shape", "shape": "rounded_rectangle", "x": 0.4, "y": 1.4, "w": 3.8, "h": 2.5, "fill": "142842"},
        {"type": "text", "text": "PAGE D'ACCUEIL", "x": 0.6, "y": 1.6, "w": 3.4, "h": 0.4,
         "font_size": 14, "color": GOLD[1:], "bold": True},
        {"type": "text", "text": "- Message de bienvenue & vision\n- Video inspirante Lord Lombo\n- Formations principales\n- CTA: parcours transformation",
         "x": 0.6, "y": 2.1, "w": 3.4, "h": 1.6, "font_size": 11, "color": "B0B8C0"},

        # A propos
        {"type": "shape", "shape": "rounded_rectangle", "x": 4.6, "y": 1.4, "w": 3.8, "h": 2.5, "fill": "142842"},
        {"type": "text", "text": "A PROPOS", "x": 4.8, "y": 1.6, "w": 3.4, "h": 0.4,
         "font_size": 14, "color": GOLD[1:], "bold": True},
        {"type": "text", "text": "- Presentation Lord Lombo\n- Mission & vision\n- Histoire de l'academie\n- Temoignages apprenants",
         "x": 4.8, "y": 2.1, "w": 3.4, "h": 1.6, "font_size": 11, "color": "B0B8C0"},

        # Programmes
        {"type": "shape", "shape": "rounded_rectangle", "x": 8.8, "y": 1.4, "w": 3.8, "h": 2.5, "fill": "142842"},
        {"type": "text", "text": "PROGRAMMES & FORMATIONS", "x": 9, "y": 1.6, "w": 3.4, "h": 0.4,
         "font_size": 14, "color": GOLD[1:], "bold": True},
        {"type": "text", "text": "- Catalogue avec filtres\n- Pages detaillees\n- Formateur, duree, prix\n- Avis & notations",
         "x": 9, "y": 2.1, "w": 3.4, "h": 1.6, "font_size": 11, "color": "B0B8C0"},

        # Espace membre
        {"type": "shape", "shape": "rounded_rectangle", "x": 0.4, "y": 4.3, "w": 3.8, "h": 2.5, "fill": "142842"},
        {"type": "text", "text": "ESPACE MEMBRE", "x": 0.6, "y": 4.5, "w": 3.4, "h": 0.4,
         "font_size": 14, "color": GOLD[1:], "bold": True},
        {"type": "text", "text": "- Dashboard personnel\n- Suivi progression (%)\n- Certificats & attestations\n- Espace Defis pratiques",
         "x": 0.6, "y": 5.0, "w": 3.4, "h": 1.6, "font_size": 11, "color": "B0B8C0"},

        # Paiement
        {"type": "shape", "shape": "rounded_rectangle", "x": 4.6, "y": 4.3, "w": 3.8, "h": 2.5, "fill": "142842"},
        {"type": "text", "text": "PAIEMENT EN LIGNE", "x": 4.8, "y": 4.5, "w": 3.4, "h": 0.4,
         "font_size": 14, "color": GOLD[1:], "bold": True},
        {"type": "text", "text": "- Carte, PayPal, Mobile Money\n- Recus & factures auto\n- Paiement unitaire\n- Abonnement mensuel",
         "x": 4.8, "y": 5.0, "w": 3.4, "h": 1.6, "font_size": 11, "color": "B0B8C0"},

        # Admin
        {"type": "shape", "shape": "rounded_rectangle", "x": 8.8, "y": 4.3, "w": 3.8, "h": 2.5, "fill": "142842"},
        {"type": "text", "text": "ESPACE ADMINISTRATEUR", "x": 9, "y": 4.5, "w": 3.4, "h": 0.4,
         "font_size": 14, "color": GOLD[1:], "bold": True},
        {"type": "text", "text": "- Gestion utilisateurs\n- Ajout/modif programmes\n- Statistiques & rapports\n- Satisfaction & analytics",
         "x": 9, "y": 5.0, "w": 3.4, "h": 1.6, "font_size": 11, "color": "B0B8C0"},
    ]
})

# SLIDE 6: Methodes pedagogiques
slides.append({
    "background_image": bg_light,
    "elements": [
        {"type": "image", "path": gold_bar, "x": 0, "y": 0, "w": W, "h": 0.06},
        {"type": "text", "text": "04  METHODES PEDAGOGIQUES", "x": 0.8, "y": 0.3, "w": 11, "h": 0.8,
         "font_size": 28, "color": BLUE_ROYAL[1:], "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 0.8, "y": 1.0, "w": 2.5, "h": 0.05, "fill": GOLD[1:]},

        {"type": "image", "path": icons["video"], "x": 1.5, "y": 1.6, "w": 0.8, "h": 0.8},
        {"type": "text", "text": "COURS ENREGISTRES", "x": 0.5, "y": 2.5, "w": 3.8, "h": 0.4,
         "font_size": 16, "color": NAVY[1:], "bold": True, "align": "center"},
        {"type": "text", "text": "Videos pre-enregistrees 24h/24\nDocuments PDF, audio, quiz\nAcces illimite\nSuivi automatique progression",
         "x": 0.5, "y": 3.0, "w": 3.8, "h": 2, "font_size": 12, "color": GRAY[1:], "align": "center"},

        {"type": "image", "path": icons["live"], "x": 5.8, "y": 1.6, "w": 0.8, "h": 0.8},
        {"type": "text", "text": "SESSIONS EN DIRECT", "x": 4.7, "y": 2.5, "w": 3.8, "h": 0.4,
         "font_size": 16, "color": NAVY[1:], "bold": True, "align": "center"},
        {"type": "text", "text": "Zoom / Google Meet integre\nNotifications & rappels auto\nInteraction temps reel\nReplays disponibles",
         "x": 4.7, "y": 3.0, "w": 3.8, "h": 2, "font_size": 12, "color": GRAY[1:], "align": "center"},

        {"type": "image", "path": icons["coaching"], "x": 10, "y": 1.6, "w": 0.8, "h": 0.8},
        {"type": "text", "text": "PARCOURS PERSONNALISE", "x": 8.9, "y": 2.5, "w": 3.8, "h": 0.4,
         "font_size": 16, "color": NAVY[1:], "bold": True, "align": "center"},
        {"type": "text", "text": "Videos + sessions live\nCoaching individuel/groupe\nDefis pratiques\nExercices d'application",
         "x": 8.9, "y": 3.0, "w": 3.8, "h": 2, "font_size": 12, "color": GRAY[1:], "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 1, "y": 5.2, "w": 11.3, "h": 1.5, "fill": NAVY[1:]},
        {"type": "text", "text": "MODELE HYBRIDE  |  La combinaison de ces 3 approches garantit une experience d'apprentissage complete, flexible et adaptee a chaque profil d'apprenant.",
         "x": 1.3, "y": 5.5, "w": 10.7, "h": 1, "font_size": 13, "color": "E0E0E0", "align": "center"},
    ]
})

# SLIDE 7: Fonctionnalites avancees
slides.append({
    "background_image": bg_dark,
    "elements": [
        {"type": "shape", "shape": "rectangle", "x": 0, "y": 0, "w": 0.06, "h": H, "fill": GOLD[1:]},
        {"type": "text", "text": "05  FONCTIONNALITES AVANCEES", "x": 0.4, "y": 0.3, "w": 12, "h": 0.8,
         "font_size": 28, "color": "FFFFFF", "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 0.4, "y": 1.0, "w": 3, "h": 0.04, "fill": GOLD[1:]},

        # Row 1
        {"type": "image", "path": icons["mobile"], "x": 1.2, "y": 1.5, "w": 0.7, "h": 0.7},
        {"type": "text", "text": "Responsive & Mobile", "x": 0.4, "y": 2.3, "w": 2.3, "h": 0.4, "font_size": 12, "color": GOLD[1:], "bold": True, "align": "center"},
        {"type": "text", "text": "Interface optimisee tous ecrans", "x": 0.4, "y": 2.7, "w": 2.3, "h": 0.5, "font_size": 10, "color": "A0A8B0", "align": "center"},

        {"type": "image", "path": icons["cert"], "x": 3.5, "y": 1.5, "w": 0.7, "h": 0.7},
        {"type": "text", "text": "Certificats Auto", "x": 2.7, "y": 2.3, "w": 2.3, "h": 0.4, "font_size": 12, "color": GOLD[1:], "bold": True, "align": "center"},
        {"type": "text", "text": "Generation PDF automatique", "x": 2.7, "y": 2.7, "w": 2.3, "h": 0.5, "font_size": 10, "color": "A0A8B0", "align": "center"},

        {"type": "image", "path": icons["notif"], "x": 5.8, "y": 1.5, "w": 0.7, "h": 0.7},
        {"type": "text", "text": "Notifications", "x": 5, "y": 2.3, "w": 2.3, "h": 0.4, "font_size": 12, "color": GOLD[1:], "bold": True, "align": "center"},
        {"type": "text", "text": "Email, push, SMS auto", "x": 5, "y": 2.7, "w": 2.3, "h": 0.5, "font_size": 10, "color": "A0A8B0", "align": "center"},

        {"type": "image", "path": icons["forum"], "x": 8.1, "y": 1.5, "w": 0.7, "h": 0.7},
        {"type": "text", "text": "Forum Communaute", "x": 7.3, "y": 2.3, "w": 2.3, "h": 0.4, "font_size": 12, "color": GOLD[1:], "bold": True, "align": "center"},
        {"type": "text", "text": "Echanges entre apprenants", "x": 7.3, "y": 2.7, "w": 2.3, "h": 0.5, "font_size": 10, "color": "A0A8B0", "align": "center"},

        {"type": "image", "path": icons["calendar"], "x": 10.4, "y": 1.5, "w": 0.7, "h": 0.7},
        {"type": "text", "text": "Calendrier Events", "x": 9.6, "y": 2.3, "w": 2.3, "h": 0.4, "font_size": 12, "color": GOLD[1:], "bold": True, "align": "center"},
        {"type": "text", "text": "Sessions live & evenements", "x": 9.6, "y": 2.7, "w": 2.3, "h": 0.5, "font_size": 10, "color": "A0A8B0", "align": "center"},

        # Row 2
        {"type": "image", "path": icons["admin"], "x": 1.2, "y": 3.5, "w": 0.7, "h": 0.7},
        {"type": "text", "text": "Dashboard Analytics", "x": 0.4, "y": 4.3, "w": 2.3, "h": 0.4, "font_size": 12, "color": GOLD[1:], "bold": True, "align": "center"},
        {"type": "text", "text": "KPI, rapports, statistiques", "x": 0.4, "y": 4.7, "w": 2.3, "h": 0.5, "font_size": 10, "color": "A0A8B0", "align": "center"},

        {"type": "image", "path": icons["star"], "x": 3.5, "y": 3.5, "w": 0.7, "h": 0.7},
        {"type": "text", "text": "Evaluation & Avis", "x": 2.7, "y": 4.3, "w": 2.3, "h": 0.4, "font_size": 12, "color": GOLD[1:], "bold": True, "align": "center"},
        {"type": "text", "text": "Notation, questionnaires", "x": 2.7, "y": 4.7, "w": 2.3, "h": 0.5, "font_size": 10, "color": "A0A8B0", "align": "center"},

        {"type": "image", "path": icons["pay"], "x": 5.8, "y": 3.5, "w": 0.7, "h": 0.7},
        {"type": "text", "text": "Paiement Securise", "x": 5, "y": 4.3, "w": 2.3, "h": 0.4, "font_size": 12, "color": GOLD[1:], "bold": True, "align": "center"},
        {"type": "text", "text": "Carte, PayPal, Mobile Money", "x": 5, "y": 4.7, "w": 2.3, "h": 0.5, "font_size": 10, "color": "A0A8B0", "align": "center"},

        {"type": "image", "path": icons["secure"], "x": 8.1, "y": 3.5, "w": 0.7, "h": 0.7},
        {"type": "text", "text": "Securite Renforcee", "x": 7.3, "y": 4.3, "w": 2.3, "h": 0.4, "font_size": 12, "color": GOLD[1:], "bold": True, "align": "center"},
        {"type": "text", "text": "SSL, 2FA, RGPD compliant", "x": 7.3, "y": 4.7, "w": 2.3, "h": 0.5, "font_size": 10, "color": "A0A8B0", "align": "center"},

        {"type": "image", "path": icons["spiritual"], "x": 10.4, "y": 3.5, "w": 0.7, "h": 0.7},
        {"type": "text", "text": "Defis Spirituels", "x": 9.6, "y": 4.3, "w": 2.3, "h": 0.4, "font_size": 12, "color": GOLD[1:], "bold": True, "align": "center"},
        {"type": "text", "text": "Exercices pratiques & suivi", "x": 9.6, "y": 4.7, "w": 2.3, "h": 0.5, "font_size": 10, "color": "A0A8B0", "align": "center"},
    ]
})

# SLIDE 8: Securite & Performance
slides.append({
    "background_image": bg_section,
    "elements": [
        {"type": "text", "text": "06", "x": 0.8, "y": 0.3, "w": 2, "h": 1,
         "font_size": 60, "color": GOLD[1:], "bold": True, "font": "Georgia"},
        {"type": "text", "text": "SECURITE &\nPERFORMANCE", "x": 0.8, "y": 1.3, "w": 5, "h": 1.4,
         "font_size": 30, "color": "FFFFFF", "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 0.8, "y": 2.8, "w": 3, "h": 0.04, "fill": GOLD[1:]},

        {"type": "shape", "shape": "rounded_rectangle", "x": 0.5, "y": 3.2, "w": 6, "h": 3.8, "fill": "0A1628"},
        {"type": "text", "text": "SECURITE", "x": 0.8, "y": 3.4, "w": 3, "h": 0.5,
         "font_size": 16, "color": GOLD[1:], "bold": True},
        {"type": "text", "text": "  Certificat SSL / HTTPS obligatoire\n  Authentification 2FA\n  Chiffrement des donnees sensibles\n  Protection DDoS & WAF\n  Conformite RGPD\n  Sauvegardes automatiques quotidiennes\n  Audit de securite regulier",
         "x": 0.8, "y": 4.0, "w": 5.5, "h": 3, "font_size": 12, "color": "C0C8D0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 6.8, "y": 3.2, "w": 6, "h": 3.8, "fill": "0A1628"},
        {"type": "text", "text": "PERFORMANCE", "x": 7.1, "y": 3.4, "w": 3, "h": 0.5,
         "font_size": 16, "color": GOLD[1:], "bold": True},
        {"type": "text", "text": "  CDN global pour streaming video\n  Cache intelligent (Redis)\n  Temps de chargement < 2 secondes\n  Architecture scalable (Cloud)\n  Base de donnees optimisee\n  Monitoring 24/7 & alertes\n  99.9% de disponibilite garantie",
         "x": 7.1, "y": 4.0, "w": 5.5, "h": 3, "font_size": 12, "color": "C0C8D0"},
    ]
})

# SLIDE 9: Identite visuelle
slides.append({
    "background_image": bg_light,
    "elements": [
        {"type": "image", "path": gold_bar, "x": 0, "y": 0, "w": W, "h": 0.06},
        {"type": "text", "text": "07  IDENTITE VISUELLE & DESIGN", "x": 0.8, "y": 0.3, "w": 11, "h": 0.8,
         "font_size": 28, "color": BLUE_ROYAL[1:], "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 0.8, "y": 1.0, "w": 2.5, "h": 0.05, "fill": GOLD[1:]},

        {"type": "text", "text": "PALETTE DE COULEURS", "x": 0.8, "y": 1.4, "w": 4, "h": 0.5,
         "font_size": 16, "color": NAVY[1:], "bold": True},
        {"type": "shape", "shape": "rounded_rectangle", "x": 0.8, "y": 2.0, "w": 1.5, "h": 1.5, "fill": "1B3A6B"},
        {"type": "text", "text": "Bleu Royal\n#1B3A6B", "x": 0.8, "y": 3.6, "w": 1.5, "h": 0.6, "font_size": 10, "color": GRAY[1:], "align": "center"},
        {"type": "shape", "shape": "rounded_rectangle", "x": 2.6, "y": 2.0, "w": 1.5, "h": 1.5, "fill": "D4A438"},
        {"type": "text", "text": "Or\n#D4A438", "x": 2.6, "y": 3.6, "w": 1.5, "h": 0.6, "font_size": 10, "color": GRAY[1:], "align": "center"},
        {"type": "shape", "shape": "rounded_rectangle", "x": 4.4, "y": 2.0, "w": 1.5, "h": 1.5, "fill": "0D2240"},
        {"type": "text", "text": "Marine\n#0D2240", "x": 4.4, "y": 3.6, "w": 1.5, "h": 0.6, "font_size": 10, "color": GRAY[1:], "align": "center"},
        {"type": "shape", "shape": "rounded_rectangle", "x": 6.2, "y": 2.0, "w": 1.5, "h": 1.5, "fill": "F0C75E"},
        {"type": "text", "text": "Or Clair\n#F0C75E", "x": 6.2, "y": 3.6, "w": 1.5, "h": 0.6, "font_size": 10, "color": GRAY[1:], "align": "center"},
        {"type": "shape", "shape": "rounded_rectangle", "x": 8, "y": 2.0, "w": 1.5, "h": 1.5, "fill": "F8F6F0"},
        {"type": "text", "text": "Creme\n#F8F6F0", "x": 8, "y": 3.6, "w": 1.5, "h": 0.6, "font_size": 10, "color": GRAY[1:], "align": "center"},

        {"type": "text", "text": "TYPOGRAPHIES", "x": 0.8, "y": 4.4, "w": 4, "h": 0.5,
         "font_size": 16, "color": NAVY[1:], "bold": True},
        {"type": "text", "text": "Titres: Georgia (serif elegant, inspiration classique)\nCorps: Calibri / Inter (lisibilite moderne)\nAccents: Italic serif pour citations inspirantes",
         "x": 0.8, "y": 5.0, "w": 5.5, "h": 1.5, "font_size": 13, "color": GRAY[1:]},

        {"type": "text", "text": "PRINCIPES DE DESIGN", "x": 7, "y": 4.4, "w": 5, "h": 0.5,
         "font_size": 16, "color": NAVY[1:], "bold": True},
        {"type": "text", "text": "Design professionnel, sobre et inspirant\nInterface claire et intuitive\nIntegration citations inspirantes\nResponsive design (mobile-first)\nAccessibilite WCAG 2.1 AA",
         "x": 7, "y": 5.0, "w": 5.5, "h": 1.5, "font_size": 13, "color": GRAY[1:]},

        {"type": "image", "path": logo_path, "x": 10, "y": 1.5, "w": 2.5, "h": 1.8},
    ]
})

# SLIDE 10: Stack technique
slides.append({
    "background_image": bg_dark,
    "elements": [
        {"type": "shape", "shape": "rectangle", "x": 0, "y": 0, "w": 0.06, "h": H, "fill": GOLD[1:]},
        {"type": "text", "text": "08  TECHNOLOGIES & STACK TECHNIQUE", "x": 0.4, "y": 0.3, "w": 12, "h": 0.8,
         "font_size": 28, "color": "FFFFFF", "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 0.4, "y": 1.0, "w": 3, "h": 0.04, "fill": GOLD[1:]},

        {"type": "shape", "shape": "rounded_rectangle", "x": 0.4, "y": 1.4, "w": 4, "h": 2.5, "fill": "142842"},
        {"type": "text", "text": "FRONTEND", "x": 0.6, "y": 1.6, "w": 3.6, "h": 0.4,
         "font_size": 16, "color": GOLD[1:], "bold": True},
        {"type": "text", "text": "Next.js 14+ (React)\nTypeScript\nTailwind CSS\nFramer Motion (animations)\nPWA Ready",
         "x": 0.6, "y": 2.1, "w": 3.6, "h": 1.6, "font_size": 12, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 4.7, "y": 1.4, "w": 4, "h": 2.5, "fill": "142842"},
        {"type": "text", "text": "BACKEND", "x": 4.9, "y": 1.6, "w": 3.6, "h": 0.4,
         "font_size": 16, "color": GOLD[1:], "bold": True},
        {"type": "text", "text": "Node.js / NestJS\nPostgreSQL + Redis\nPrisma ORM\nAPI REST & GraphQL\nWebSocket (temps reel)",
         "x": 4.9, "y": 2.1, "w": 3.6, "h": 1.6, "font_size": 12, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 9, "y": 1.4, "w": 4, "h": 2.5, "fill": "142842"},
        {"type": "text", "text": "INFRASTRUCTURE", "x": 9.2, "y": 1.6, "w": 3.6, "h": 0.4,
         "font_size": 16, "color": GOLD[1:], "bold": True},
        {"type": "text", "text": "AWS / Vercel (Cloud)\nDocker & CI/CD\nCloudflare CDN\nS3 (stockage media)\nMonitoring Datadog",
         "x": 9.2, "y": 2.1, "w": 3.6, "h": 1.6, "font_size": 12, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 0.4, "y": 4.3, "w": 4, "h": 2.5, "fill": "142842"},
        {"type": "text", "text": "PAIEMENTS", "x": 0.6, "y": 4.5, "w": 3.6, "h": 0.4,
         "font_size": 16, "color": GOLD[1:], "bold": True},
        {"type": "text", "text": "Stripe (Carte bancaire)\nPayPal Business\nMobile Money API\nFacturation automatique\nWebhooks securises",
         "x": 0.6, "y": 5.0, "w": 3.6, "h": 1.6, "font_size": 12, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 4.7, "y": 4.3, "w": 4, "h": 2.5, "fill": "142842"},
        {"type": "text", "text": "SEO & REFERENCEMENT", "x": 4.9, "y": 4.5, "w": 3.6, "h": 0.4,
         "font_size": 16, "color": GOLD[1:], "bold": True},
        {"type": "text", "text": "SSR & SSG (Next.js)\nSchema.org structuree\nSitemap & robots.txt\nOpen Graph & Twitter Cards\nGoogle Analytics 4",
         "x": 4.9, "y": 5.0, "w": 3.6, "h": 1.6, "font_size": 12, "color": "B0B8C0"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 9, "y": 4.3, "w": 4, "h": 2.5, "fill": "142842"},
        {"type": "text", "text": "VIDEO & STREAMING", "x": 9.2, "y": 4.5, "w": 3.6, "h": 0.4,
         "font_size": 16, "color": GOLD[1:], "bold": True},
        {"type": "text", "text": "Mux / Cloudflare Stream\nHLS adaptive bitrate\nProtection DRM contenu\nZoom SDK integration\nTranscodage automatique",
         "x": 9.2, "y": 5.0, "w": 3.6, "h": 1.6, "font_size": 12, "color": "B0B8C0"},
    ]
})

# SLIDE 11: Evolutions futures
slides.append({
    "background_image": bg_light,
    "elements": [
        {"type": "image", "path": gold_bar, "x": 0, "y": 0, "w": W, "h": 0.06},
        {"type": "text", "text": "09  EVOLUTIONS FUTURES", "x": 0.8, "y": 0.3, "w": 11, "h": 0.8,
         "font_size": 28, "color": BLUE_ROYAL[1:], "bold": True, "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 0.8, "y": 1.0, "w": 2.5, "h": 0.05, "fill": GOLD[1:]},

        {"type": "shape", "shape": "rounded_rectangle", "x": 0.5, "y": 1.5, "w": 3, "h": 4, "fill": NAVY[1:]},
        {"type": "text", "text": "PHASE 1", "x": 0.7, "y": 1.7, "w": 2.6, "h": 0.4, "font_size": 18, "color": GOLD[1:], "bold": True, "align": "center"},
        {"type": "text", "text": "MVP & Lancement", "x": 0.7, "y": 2.2, "w": 2.6, "h": 0.4, "font_size": 14, "color": "FFFFFF", "align": "center", "bold": True},
        {"type": "text", "text": "Site web complet\nEspace membre\nPaiement en ligne\nCours enregistres\nDashboard admin",
         "x": 0.7, "y": 2.8, "w": 2.6, "h": 2.5, "font_size": 12, "color": "C0C8D0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 3.8, "y": 1.5, "w": 3, "h": 4, "fill": NAVY[1:]},
        {"type": "text", "text": "PHASE 2", "x": 4, "y": 1.7, "w": 2.6, "h": 0.4, "font_size": 18, "color": GOLD[1:], "bold": True, "align": "center"},
        {"type": "text", "text": "Enrichissement", "x": 4, "y": 2.2, "w": 2.6, "h": 0.4, "font_size": 14, "color": "FFFFFF", "align": "center", "bold": True},
        {"type": "text", "text": "Sessions live Zoom\nForum communautaire\nCertificats auto\nNotifications avancees\nCalendrier events",
         "x": 4, "y": 2.8, "w": 2.6, "h": 2.5, "font_size": 12, "color": "C0C8D0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 7.1, "y": 1.5, "w": 3, "h": 4, "fill": NAVY[1:]},
        {"type": "text", "text": "PHASE 3", "x": 7.3, "y": 1.7, "w": 2.6, "h": 0.4, "font_size": 18, "color": GOLD[1:], "bold": True, "align": "center"},
        {"type": "text", "text": "Expansion", "x": 7.3, "y": 2.2, "w": 2.6, "h": 0.4, "font_size": 14, "color": "FFFFFF", "align": "center", "bold": True},
        {"type": "text", "text": "App mobile iOS/Android\nProgramme mentorat\nSysteme affiliation\nIA recommandations\nMulti-langue",
         "x": 7.3, "y": 2.8, "w": 2.6, "h": 2.5, "font_size": 12, "color": "C0C8D0", "align": "center"},

        {"type": "shape", "shape": "rounded_rectangle", "x": 10.4, "y": 1.5, "w": 2.5, "h": 4, "fill": GOLD[1:]},
        {"type": "text", "text": "VISION", "x": 10.5, "y": 1.7, "w": 2.3, "h": 0.4, "font_size": 18, "color": NAVY[1:], "bold": True, "align": "center"},
        {"type": "text", "text": "Reference\nFrancophone", "x": 10.5, "y": 2.2, "w": 2.3, "h": 0.5, "font_size": 14, "color": NAVY[1:], "align": "center", "bold": True},
        {"type": "text", "text": "Ecosysteme complet de formation spirituelle & leadership en Afrique et dans la diaspora",
         "x": 10.5, "y": 2.9, "w": 2.3, "h": 2.3, "font_size": 11, "color": "1A2D50", "align": "center"},
    ]
})

# SLIDE 12: Conclusion / Merci
slides.append({
    "background_image": bg_dark,
    "elements": [
        {"type": "shape", "shape": "rectangle", "x": 0, "y": 3.2, "w": W, "h": 0.06, "fill": GOLD[1:]},
        {"type": "image", "path": logo_path, "x": 4.8, "y": 0.5, "w": 3.7, "h": 2.7},
        {"type": "text", "text": "LORD LOMBO ACADEMIE", "x": 0.5, "y": 3.5, "w": 12.3, "h": 0.8,
         "font_size": 36, "color": GOLD[1:], "bold": True, "align": "center", "font": "Georgia"},
        {"type": "text", "text": "Transformation  -  Leadership  -  Impact", "x": 2, "y": 4.3, "w": 9.3, "h": 0.6,
         "font_size": 18, "color": "CADCFC", "align": "center", "font": "Georgia"},
        {"type": "shape", "shape": "rectangle", "x": 5.5, "y": 5.0, "w": 2.3, "h": 0.04, "fill": GOLD[1:]},
        {"type": "text", "text": "Prets a batir ensemble une plateforme d'excellence\nqui transformera des vies.",
         "x": 2, "y": 5.3, "w": 9.3, "h": 0.8, "font_size": 16, "color": "A0B0C0", "align": "center"},
        {"type": "text", "text": "MERCI POUR VOTRE CONFIANCE", "x": 2, "y": 6.3, "w": 9.3, "h": 0.5,
         "font_size": 14, "color": GOLD[1:], "align": "center", "bold": True},
    ]
})

spec = {
    "width": W,
    "height": H,
    "slides": slides
}

spec_path = os.path.join(BASE, "spec.json")
with open(spec_path, "w") as f:
    json.dump(spec, f, indent=2)

print(f"Spec generated with {len(slides)} slides at {spec_path}")
