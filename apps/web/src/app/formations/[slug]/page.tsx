"use client";

import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AnimatedSection, Badge, Button } from "@/components/ui";
import { useI18n } from "@/context/i18n-context";
import { useAuth } from "@/context/auth-context";
import api from "@/lib/api";
import PaymentModal from "@/components/payment/payment-modal";
import {
  FaArrowLeft, FaClock, FaBookOpen, FaUserTie, FaCheckCircle, FaPlay,
  FaStar, FaGraduationCap, FaChevronDown, FaChevronUp, FaLock, FaGlobe,
  FaCertificate, FaUsers, FaCalendarAlt, FaLaptop, FaSpinner, FaTimes,
} from "react-icons/fa";

interface ModuleData {
  title: string;
  lessons: { title: string; duration: string; free?: boolean }[];
}

interface FormationData {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  gradient: string;
  price: string;
  level: string;
  duration: string;
  modules: ModuleData[];
  instructor: { name: string; title: string; bio: string; image: string };
  objectives: string[];
  prerequisites: string[];
  audience: string[];
  certification: string;
  stats: { students: number; rating: number; completion: number };
  testimonials: { name: string; role: string; text: string; rating: number }[];
}

const formationsData: Record<string, FormationData> = {
  "fondements-foi-leadership": {
    slug: "fondements-foi-leadership",
    title: "Fondements de la Foi & Leadership Spirituel",
    subtitle: "Batissez une fondation indestructible pour votre ministere",
    description: "Ce programme intensif de 12 semaines vous plonge au coeur des principes bibliques fondamentaux qui forment les leaders spirituels les plus influents de notre epoque. A travers des enseignements profonds, des etudes de cas reels et des exercices pratiques, vous developperez une comprehension solide de la foi chretienne et du leadership serviteur.",
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1920&h=800&fit=crop",
    gradient: "from-indigo-600/80 to-purple-900/90",
    price: "149", level: "Tous niveaux", duration: "12 semaines",
    instructor: {
      name: "Pasteur Mukendi", title: "Docteur en Theologie, 15 ans de ministere",
      bio: "Ancien de l'Eglise de Kinshasa, le Pasteur Mukendi a forme plus de 500 leaders pastoraux a travers l'Afrique francophone. Diplome de la Faculte de Theologie de Paris, il combine rigueur academique et onction spirituelle.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    },
    objectives: [
      "Maitriser les 7 piliers fondamentaux de la foi chretienne",
      "Developper un style de leadership serviteur authentique",
      "Savoir etudier et interpreter la Bible de maniere contextuelle",
      "Construire une vision ministerielle claire et actionnable",
      "Gerer efficacement une equipe de ministere",
      "Developper une vie de priere structuree et puissante",
    ],
    prerequisites: ["Aucun prerequis academique requis", "Engagement de 5h minimum par semaine", "Acces internet stable pour les sessions live"],
    audience: ["Nouveaux croyants souhaitant approfondir leur foi", "Futurs leaders de cellules ou groupes de maison", "Responsables d'eglise en debut de ministere", "Toute personne desirant grandir spirituellement"],
    certification: "Certificat LL Academie - Fondements de la Foi (reconnu par 12 denominations)",
    stats: { students: 347, rating: 4.9, completion: 92 },
    modules: [
      { title: "Module 1 — L'identite du croyant", lessons: [
        { title: "Qui suis-je en Christ ? Les 21 declarations bibliques", duration: "45 min", free: true },
        { title: "La nouvelle naissance : au-dela de la theorie", duration: "38 min" },
        { title: "Exercice pratique : Journal d'identite spirituelle", duration: "25 min" },
        { title: "Etude de cas : De persecuteur a apotre — la transformation de Paul", duration: "52 min" },
      ]},
      { title: "Module 2 — La priere qui transforme", lessons: [
        { title: "Les 5 types de priere biblique", duration: "41 min", free: true },
        { title: "Construire un planning de priere personnalise", duration: "33 min" },
        { title: "Le jeune : principes et pratiques", duration: "47 min" },
        { title: "Atelier live : Session de priere dirigee", duration: "60 min" },
      ]},
      { title: "Module 3 — Etude biblique methodique", lessons: [
        { title: "La methode inductive : observation, interpretation, application", duration: "55 min" },
        { title: "Outils numeriques pour l'etude biblique", duration: "28 min" },
        { title: "Hermeneutique : eviter les pieges d'interpretation", duration: "48 min" },
        { title: "TP : Preparer une etude biblique complete", duration: "40 min" },
      ]},
      { title: "Module 4 — Le leadership serviteur", lessons: [
        { title: "Jesus leader : le modele ultime de service", duration: "42 min" },
        { title: "Les 5 niveaux de leadership selon Maxwell (adapte au ministere)", duration: "50 min" },
        { title: "Gestion des conflits dans l'eglise locale", duration: "45 min" },
        { title: "Deleguer sans abandonner : l'art de former des disciples", duration: "38 min" },
      ]},
      { title: "Module 5 — Vision et planification ministerielle", lessons: [
        { title: "Discerner l'appel de Dieu : methodologie pratique", duration: "47 min" },
        { title: "Rediger un enonce de vision en 7 etapes", duration: "35 min" },
        { title: "Plan strategique ministeriel sur 3 ans", duration: "55 min" },
        { title: "Evaluation finale et certification", duration: "30 min" },
      ]},
    ],
    testimonials: [
      { name: "Grace Mboma", role: "Responsable de cellule, Lubumbashi", text: "Cette formation a completement change ma maniere d'aborder le ministere. Les modules sont concrets, applicables immediatement. Mon groupe de maison est passe de 8 a 35 personnes en 4 mois.", rating: 5 },
      { name: "Emmanuel Tshisekedi", role: "Pasteur assistant, Brazzaville", text: "Le module sur le leadership serviteur m'a donne des outils que je n'avais jamais appris en 10 ans de seminaire. Excellent rapport qualite-prix.", rating: 5 },
      { name: "Ruth Kalala", role: "Etudiante en theologie, Paris", text: "Les sessions live avec Pasteur Mukendi sont d'une richesse incroyable. On sent l'experience et l'onction dans chaque enseignement.", rating: 5 },
    ],
  },
  "leadership-vision-ministerielle": {
    slug: "leadership-vision-ministerielle",
    title: "Leadership & Vision Ministerielle",
    subtitle: "Devenez le leader visionnaire que votre communaute attend",
    description: "Programme avance de 16 semaines pour les leaders en exercice. Approfondissez votre capacite a cast une vision convaincante, mobiliser des equipes et gerer la croissance de votre ministere avec excellence et integrite.",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1920&h=800&fit=crop",
    gradient: "from-amber-600/80 to-orange-900/90",
    price: "199", level: "Intermediaire", duration: "16 semaines",
    instructor: {
      name: "Sarah Mbuyi", title: "Coach certifiee ICF, Formatrice en leadership",
      bio: "Avec plus de 10 ans d'experience en coaching ministeriel, Sarah a accompagne des dizaines de pasteurs et leaders a travers l'Afrique et l'Europe. Sa double expertise — coaching professionnel et ministere — en fait une formatrice unique.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop",
    },
    objectives: [
      "Definir et communiquer une vision ministerielle percutante",
      "Maitriser les outils de management d'equipe en contexte ministeriel",
      "Gerer la croissance et les transitions dans l'eglise",
      "Developper un systeme de mentorat reproductible",
      "Maitriser la gestion financiere d'un ministere",
      "Construire une culture d'excellence et de redevabilite",
    ],
    prerequisites: ["2 ans minimum d'experience en leadership", "Avoir complete 'Fondements de la Foi' ou equivalent", "Engagement de 8h minimum par semaine"],
    audience: ["Pasteurs en exercice", "Leaders de departements d'eglise", "Fondateurs de ministeres", "Directeurs d'organisations chretiennes"],
    certification: "Certificat LL Academie — Leadership Ministeriel Avance",
    stats: { students: 189, rating: 4.8, completion: 88 },
    modules: [
      { title: "Module 1 — L'ADN du leader visionnaire", lessons: [
        { title: "Les 10 qualites non-negociables du leader spirituel", duration: "50 min", free: true },
        { title: "Auto-evaluation : votre profil de leadership", duration: "35 min" },
        { title: "Etude de cas : Nehemie — de l'echanson au batisseur", duration: "55 min" },
        { title: "Workshop : Votre declaration de leadership", duration: "40 min" },
      ]},
      { title: "Module 2 — Communiquer la vision", lessons: [
        { title: "L'art du storytelling ministeriel", duration: "45 min" },
        { title: "Techniques de prise de parole en public", duration: "52 min" },
        { title: "Creer un plan de communication pour votre eglise", duration: "38 min" },
        { title: "TP live : Presenter votre vision en 7 minutes", duration: "60 min" },
      ]},
      { title: "Module 3 — Management d'equipe ministerielle", lessons: [
        { title: "Recruter, former et retenir des benevoles", duration: "48 min" },
        { title: "La delegation strategique dans le ministere", duration: "42 min" },
        { title: "Gerer les personnalites difficiles avec grace", duration: "45 min" },
        { title: "Construire une charte d'equipe efficace", duration: "35 min" },
      ]},
      { title: "Module 4 — Gestion financiere et administrative", lessons: [
        { title: "Principes bibliques de gestion financiere", duration: "40 min" },
        { title: "Elaborer un budget ministeriel realiste", duration: "50 min" },
        { title: "Transparence et redevabilite financiere", duration: "35 min" },
        { title: "Fundraising ethique pour le ministere", duration: "45 min" },
      ]},
      { title: "Module 5 — Gerer la croissance", lessons: [
        { title: "Les 5 phases de croissance d'une eglise", duration: "55 min" },
        { title: "Implanter une eglise : guide pas-a-pas", duration: "60 min" },
        { title: "Gerer les transitions et les crises", duration: "48 min" },
        { title: "Projet final : Plan strategique sur 5 ans", duration: "45 min" },
      ]},
    ],
    testimonials: [
      { name: "Pasteur David Konde", role: "Fondateur, Eglise Nouvelle Alliance — Kinshasa", text: "Sarah Mbuyi est une coach exceptionnelle. Grace a cette formation, notre eglise est passee de 120 a 450 membres en un an, avec des systemes solides en place.", rating: 5 },
      { name: "Marie-Claire Nzuzi", role: "Directrice, ONG Compassion Active", text: "Le module sur la gestion financiere a transforme notre approche. Nous avons double nos dons en implementant les principes appris.", rating: 5 },
    ],
  },
  "communication-influence": {
    slug: "communication-influence",
    title: "Communication & Influence Positive",
    subtitle: "Impactez votre entourage par la puissance de vos mots",
    description: "Apprenez a communiquer avec impact, a influencer positivement votre communaute et a utiliser les medias modernes pour etendre la portee de votre message. Un programme pratique de 10 semaines combine theorie et mise en pratique immediate.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=800&fit=crop",
    gradient: "from-emerald-600/80 to-teal-900/90",
    price: "129", level: "Tous niveaux", duration: "10 semaines",
    instructor: { name: "Sarah Mbuyi", title: "Specialiste en communication ministerielle", bio: "Experte en communication digitale et relations publiques appliquees au contexte ministeriel.", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop" },
    objectives: ["Maitriser l'art de la prise de parole en public", "Creer du contenu engageant pour les reseaux sociaux", "Developper une strategie de communication pour son ministere", "Utiliser le storytelling pour transmettre des verites bibliques"],
    prerequisites: ["Aucun prerequis requis"],
    audience: ["Leaders et communicateurs", "Responsables medias d'eglise", "Predicateurs et enseignants", "Community managers"],
    certification: "Certificat LL Academie — Communication & Medias",
    stats: { students: 256, rating: 4.7, completion: 90 },
    modules: [
      { title: "Module 1 — Les fondamentaux de la communication", lessons: [
        { title: "Les 7 principes d'une communication efficace", duration: "40 min", free: true },
        { title: "Votre style de communication : test et analyse", duration: "30 min" },
        { title: "L'ecoute active : la competence la plus sous-estimee", duration: "35 min" },
      ]},
      { title: "Module 2 — Prise de parole et predication", lessons: [
        { title: "Structure d'un message percutant", duration: "50 min" },
        { title: "Gerer le trac et captiver son auditoire", duration: "42 min" },
        { title: "TP : Enregistrer et analyser votre predication", duration: "45 min" },
      ]},
      { title: "Module 3 — Communication digitale", lessons: [
        { title: "Strategie social media pour le ministere", duration: "48 min" },
        { title: "Creer des visuels professionnels avec Canva", duration: "40 min" },
        { title: "YouTube, podcasts et streaming live", duration: "55 min" },
      ]},
    ],
    testimonials: [
      { name: "Joel Musala", role: "Pasteur media, Kinshasa", text: "Le module sur le digital a propulse notre presence en ligne. Nous atteignons maintenant 50 000 personnes par semaine sur nos plateformes.", rating: 5 },
    ],
  },
  "counseling-pastoral-avance": {
    slug: "counseling-pastoral-avance",
    title: "Counseling Pastoral Avance",
    subtitle: "Accompagnez les ames avec competence et compassion",
    description: "Formation avancee de 20 semaines pour les pasteurs et conseillers. Aborde les problematiques contemporaines (depression, addictions, crises conjugales, traumatismes) avec une approche biblique integree aux sciences humaines.",
    image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=1920&h=800&fit=crop",
    gradient: "from-blue-600/80 to-indigo-900/90",
    price: "249", level: "Avance", duration: "20 semaines",
    instructor: { name: "Pasteur Mukendi", title: "Conseiller pastoral certifie AACC", bio: "Forme en psychologie pastorale, le Pasteur Mukendi a conduit plus de 2000 seances de counseling en 15 ans.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" },
    objectives: ["Maitriser les techniques de counseling pastoral biblique", "Savoir accompagner les personnes en crise", "Gerer les cas de depression, deuil et traumatismes", "Mettre en place un ministere de counseling structure"],
    prerequisites: ["3 ans minimum de ministere pastoral", "Formation de base en theologie", "Recommandation d'un pasteur senior"],
    audience: ["Pasteurs seniors", "Conseillers pastoraux en exercice", "Aumonders", "Responsables de ministeres sociaux"],
    certification: "Certificat LL Academie — Counseling Pastoral Avance",
    stats: { students: 98, rating: 4.9, completion: 85 },
    modules: [
      { title: "Module 1 — Fondements du counseling biblique", lessons: [
        { title: "Theologie du counseling : approche integrative", duration: "55 min", free: true },
        { title: "L'ethique du conseiller pastoral", duration: "40 min" },
        { title: "Ecoute, empathie et limites saines", duration: "45 min" },
        { title: "Etude de cas : situations reelles (anonymisees)", duration: "60 min" },
      ]},
      { title: "Module 2 — Depression et anxiete", lessons: [
        { title: "Comprendre la depression : dimensions spirituelle et medicale", duration: "50 min" },
        { title: "Protocole d'accompagnement en 8 seances", duration: "55 min" },
        { title: "Quand referer : collaboration avec les professionnels de sante", duration: "35 min" },
      ]},
      { title: "Module 3 — Crises conjugales et familiales", lessons: [
        { title: "Les 4 cavaliers destructeurs (Gottman applique au ministere)", duration: "48 min" },
        { title: "Protocole de reconciliation conjugale", duration: "55 min" },
        { title: "Accompagner les enfants dans les crises familiales", duration: "42 min" },
      ]},
    ],
    testimonials: [
      { name: "Pasteur Josue Lunda", role: "Pasteur senior, Eglise Bethel — Lubumbashi", text: "Cette formation devrait etre obligatoire pour tout pasteur. Elle m'a donne des outils concrets pour accompagner dignement les ames en souffrance.", rating: 5 },
    ],
  },
  "louange-adoration": {
    slug: "louange-adoration",
    title: "Louange, Adoration & Ministere Musical",
    subtitle: "Elevez votre ministere de louange a un autre niveau",
    description: "Programme de 8 semaines pour les chantres, musiciens et directeurs de louange. Techniques vocales, theologie de l'adoration, direction de chorale et gestion d'une equipe de louange.",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1920&h=800&fit=crop",
    gradient: "from-rose-600/80 to-pink-900/90",
    price: "119", level: "Tous niveaux", duration: "8 semaines",
    instructor: { name: "Sarah Mbuyi", title: "Directrice de louange, 10 ans d'experience", bio: "Chantre et directrice de louange reconnue, Sarah a dirige des moments d'adoration devant des milliers de personnes.", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop" },
    objectives: ["Comprendre la theologie biblique de l'adoration", "Ameliorer sa technique vocale et musicale", "Diriger un moment de louange avec onction et structure", "Gerer et former une equipe de louange"],
    prerequisites: ["Pratiquer un instrument ou chanter depuis au moins 1 an"],
    audience: ["Chantres et choristes", "Musiciens d'eglise", "Directeurs de louange", "Futurs worship leaders"],
    certification: "Certificat LL Academie — Ministere Musical",
    stats: { students: 412, rating: 4.8, completion: 94 },
    modules: [
      { title: "Module 1 — Theologie de l'adoration", lessons: [
        { title: "L'adoration dans l'Ancien et le Nouveau Testament", duration: "45 min", free: true },
        { title: "Le role du chantre selon la Bible", duration: "38 min" },
        { title: "Adoration vs performance : ou est la ligne ?", duration: "42 min" },
      ]},
      { title: "Module 2 — Technique vocale", lessons: [
        { title: "Respiration, posture et projection", duration: "40 min" },
        { title: "Harmonisation et chant a plusieurs voix", duration: "50 min" },
        { title: "Exercices pratiques quotidiens (15 min/jour)", duration: "20 min" },
      ]},
      { title: "Module 3 — Diriger la louange", lessons: [
        { title: "Preparer et structurer un moment de louange", duration: "48 min" },
        { title: "Suivre le Saint-Esprit tout en restant structure", duration: "42 min" },
        { title: "Gerer les transitions et les moments spontanes", duration: "35 min" },
      ]},
    ],
    testimonials: [
      { name: "Esther Lokadi", role: "Chantre, Eglise Tabernacle — Kinshasa", text: "Avant cette formation, je chantais avec passion mais sans structure. Maintenant je dirige nos 45 minutes de louange avec confiance et sensibilite a l'Esprit.", rating: 5 },
    ],
  },
  "mentorat-ministeriel": {
    slug: "mentorat-ministeriel",
    title: "Programme de Mentorat Ministeriel",
    subtitle: "Un accompagnement personnalise par des mentors d'exception",
    description: "Programme exclusif sur 6 mois avec mentorat individuel. Chaque participant est jumelé avec un mentor senior pour un accompagnement personnalise. Places limitees a 20 participants par cohorte.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920&h=800&fit=crop",
    gradient: "from-violet-600/80 to-indigo-900/90",
    price: "Sur devis", level: "Sur candidature", duration: "6 mois",
    instructor: { name: "Lord Lombo", title: "Fondateur de LL Academie", bio: "Artiste, pasteur et visionnaire, Lord Lombo partage sa riche experience ministerielle a travers ce programme de mentorat exclusif.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" },
    objectives: ["Beneficier d'un accompagnement personnalise", "Developper un plan ministeriel sur mesure", "Acceder a un reseau de leaders d'exception", "Recevoir du feedback direct sur votre ministere"],
    prerequisites: ["5 ans minimum de ministere actif", "Lettre de motivation", "Entretien de selection avec le comite", "Engagement sur 6 mois complets"],
    audience: ["Pasteurs principaux", "Fondateurs de mouvements", "Leaders en transition majeure"],
    certification: "Attestation LL Academie — Mentorat Ministeriel Premium",
    stats: { students: 42, rating: 5.0, completion: 100 },
    modules: [
      { title: "Mois 1-2 — Diagnostic et vision", lessons: [
        { title: "Bilan ministeriel complet (360 degres)", duration: "Session 1:1" },
        { title: "Clarification de la vision et des valeurs", duration: "Session 1:1" },
        { title: "Masterclass live : Les saisons du ministere", duration: "2h" },
      ]},
      { title: "Mois 3-4 — Strategies et systemes", lessons: [
        { title: "Mise en place de systemes de croissance", duration: "Session 1:1" },
        { title: "Gestion du stress et equilibre vie-ministere", duration: "Session 1:1" },
        { title: "Retraite de groupe : 48h d'immersion", duration: "Weekend" },
      ]},
      { title: "Mois 5-6 — Implementation et lancement", lessons: [
        { title: "Suivi de l'implementation du plan", duration: "Session 1:1" },
        { title: "Presentation du projet final devant le groupe", duration: "2h" },
        { title: "Ceremonie de graduation et networking", duration: "Evenement" },
      ]},
    ],
    testimonials: [
      { name: "Pasteur Pierre Tshimanga", role: "Fondateur, Ministere Impact Nations", text: "Le mentorat avec Lord Lombo a ete l'experience la plus transformatrice de mes 20 ans de ministere. Un programme qui vaut infiniment plus que son prix.", rating: 5 },
    ],
  },
  "gestion-emotions-resilience": {
    slug: "gestion-emotions-resilience",
    title: "Gestion des Emotions & Resilience",
    subtitle: "Fortifiez votre monde interieur pour un impact durable",
    description: "Programme de 8 semaines pour apprendre a gerer ses emotions, developper la resilience et maintenir une sante mentale et spirituelle solide dans le contexte exigeant du ministere.",
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1920&h=800&fit=crop",
    gradient: "from-cyan-600/80 to-blue-900/90",
    price: "139", level: "Tous niveaux", duration: "8 semaines",
    instructor: { name: "Sarah Mbuyi", title: "Coach en intelligence emotionnelle", bio: "Certifiee en intelligence emotionnelle et PNL, Sarah aide les leaders a construire une vie interieure saine et resiliente.", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop" },
    objectives: ["Identifier et gerer ses emotions au quotidien", "Developper une resilience a toute epreuve", "Prevenir le burnout ministeriel", "Construire des relations saines et equilibrees"],
    prerequisites: ["Aucun prerequis"],
    audience: ["Leaders et pasteurs", "Benevoles engages", "Toute personne en quete de croissance personnelle"],
    certification: "Certificat LL Academie — Intelligence Emotionnelle",
    stats: { students: 198, rating: 4.8, completion: 91 },
    modules: [
      { title: "Module 1 — Comprendre ses emotions", lessons: [
        { title: "La roue des emotions : identifier ce que vous ressentez", duration: "35 min", free: true },
        { title: "Emotions et spiritualite : une perspective biblique", duration: "42 min" },
        { title: "Exercice : Journal emotionnel sur 7 jours", duration: "15 min" },
      ]},
      { title: "Module 2 — Resilience et force interieure", lessons: [
        { title: "Les 7 piliers de la resilience", duration: "48 min" },
        { title: "Prevenir le burnout : signes et solutions", duration: "40 min" },
        { title: "Construire des rituels de ressourcement", duration: "35 min" },
      ]},
    ],
    testimonials: [
      { name: "Lydia Kasongo", role: "Pasteure, Eglise Gracia — Douala", text: "J'etais au bord du burnout quand j'ai commence cette formation. Elle m'a litteralement sauvee et m'a donne des outils que j'utilise chaque jour.", rating: 5 },
    ],
  },
  "leadership-feminin": {
    slug: "leadership-feminin",
    title: "Leadership Feminin dans le Ministere",
    subtitle: "Osez briller selon votre appel unique",
    description: "Programme specifiquement concu pour les femmes en position de leadership ministeriel. Aborde les defis uniques, developpe la confiance et offre des strategies adaptees pour un leadership feminin efficace et respecte.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1920&h=800&fit=crop",
    gradient: "from-fuchsia-600/80 to-purple-900/90",
    price: "179", level: "Intermediaire", duration: "12 semaines",
    instructor: { name: "Sarah Mbuyi", title: "Coach en leadership feminin", bio: "Pionniere du coaching ministeriel au feminin en Afrique francophone, Sarah a forme plus de 200 femmes leaders.", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop" },
    objectives: ["Affirmer son identite de leader en tant que femme", "Naviguer les defis specifiques du leadership feminin", "Developper un reseau de soutien entre femmes leaders", "Construire un legacy generationnel"],
    prerequisites: ["Etre femme en position de leadership ou aspirante"],
    audience: ["Pasteures et co-pasteures", "Responsables de ministeres feminins", "Femmes entrepreneurs chretiennes", "Leaders de groupes de femmes"],
    certification: "Certificat LL Academie — Leadership Feminin",
    stats: { students: 156, rating: 4.9, completion: 93 },
    modules: [
      { title: "Module 1 — Identite et appel", lessons: [
        { title: "Les femmes leaders dans la Bible : modeles inspires", duration: "50 min", free: true },
        { title: "Surmonter le syndrome de l'imposteur", duration: "42 min" },
        { title: "Definir votre style de leadership unique", duration: "38 min" },
      ]},
      { title: "Module 2 — Naviguer les defis", lessons: [
        { title: "Leadership et soumission : ce que la Bible dit vraiment", duration: "55 min" },
        { title: "Gerer les resistances culturelles et ecclesiastiques", duration: "45 min" },
        { title: "Equilibre famille-ministere : strategies pratiques", duration: "40 min" },
      ]},
    ],
    testimonials: [
      { name: "Pasteure Rachel Mwamba", role: "Co-fondatrice, Eglise La Source — Bruxelles", text: "Cette formation m'a donne la confiance et les outils pour assumer pleinement mon appel. Le groupe de femmes leaders est devenu ma famille.", rating: 5 },
    ],
  },
  "theologie-pratique": {
    slug: "theologie-pratique",
    title: "Theologie Pratique & Exegese",
    subtitle: "Creusez les Ecritures avec methode et profondeur",
    description: "Formation avancee de 18 semaines pour ceux qui veulent aller plus loin dans l'etude systematique de la Bible. Hermeneutique, exegese, theologie biblique et systematique enseignees de maniere accessible et applicable.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&h=800&fit=crop",
    gradient: "from-slate-600/80 to-gray-900/90",
    price: "219", level: "Avance", duration: "18 semaines",
    instructor: { name: "Pasteur Mukendi", title: "Docteur en Theologie, Enseignant", bio: "Titulaire d'un doctorat en theologie de la Faculte de Paris avec specialisation en Nouveau Testament.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" },
    objectives: ["Maitriser les outils d'exegese biblique", "Comprendre les grands courants theologiques", "Preparer des messages bibliquement solides", "Enseigner avec autorite et clarte"],
    prerequisites: ["Avoir complete 'Fondements de la Foi' ou equivalent", "Connaissance de base de la Bible"],
    audience: ["Enseignants de la Parole", "Etudiants en theologie", "Pasteurs souhaitant approfondir", "Auteurs et blogueurs chretiens"],
    certification: "Certificat LL Academie — Theologie Pratique",
    stats: { students: 87, rating: 4.9, completion: 82 },
    modules: [
      { title: "Module 1 — Introduction a l'hermeneutique", lessons: [
        { title: "Pourquoi l'interpretation compte : erreurs courantes", duration: "50 min", free: true },
        { title: "Les genres litteraires de la Bible", duration: "45 min" },
        { title: "Contexte historique, culturel et litteraire", duration: "55 min" },
      ]},
      { title: "Module 2 — Methodes d'exegese", lessons: [
        { title: "Exegese pas-a-pas : methode pratique", duration: "60 min" },
        { title: "Utiliser les outils (Strong, commentaires, langues originales)", duration: "50 min" },
        { title: "TP : Exegese complete d'un passage paulinien", duration: "45 min" },
      ]},
    ],
    testimonials: [
      { name: "Prof. Samuel Ngandu", role: "Enseignant, Institut Biblique de Kinshasa", text: "Une formation digne d'un niveau universitaire mais accessible a tous. Le Pasteur Mukendi rend la theologie vivante et pratique.", rating: 5 },
    ],
  },
};

export default function FormationDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { locale } = useI18n();
  const { user } = useAuth();
  const [openModule, setOpenModule] = useState<number>(0);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollToast, setEnrollToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formation, setFormation] = useState<FormationData | null>(formationsData[slug] || null);

  useEffect(() => {
    api.get<any>(`/courses/${slug}`)
      .then((course) => {
        const imgBase = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "https://prod-llm.onrender.com";
        const resolveImg = (img: string | null) => img ? (img.startsWith("http") ? img : `${imgBase}${img}`) : "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1920&h=800&fit=crop";
        const apiFormation: FormationData = {
          slug: course.slug,
          title: course.title,
          subtitle: course.description?.substring(0, 100) + "..." || "",
          description: course.description || "",
          image: resolveImg(course.image || course.thumbnail),
          gradient: "from-indigo-600/80 to-purple-900/90",
          price: course.price != null ? String(course.price) : "0",
          level: course.level || "Tous niveaux",
          duration: course.duration ? `${course.duration} semaines` : "8 semaines",
          modules: (course.modules || []).map((m: any) => ({
            title: m.title,
            lessons: (m.lessons || []).map((l: any) => ({
              title: l.title,
              duration: l.duration || "30 min",
              free: l.free || l.order === 1,
            })),
          })),
          instructor: course.instructor ? {
            name: `${course.instructor.firstName} ${course.instructor.lastName}`.trim(),
            title: course.instructor.bio?.substring(0, 60) || "Formateur",
            bio: course.instructor.bio || "",
            image: resolveImg(course.instructor.avatar),
          } : { name: "Equipe LL Academie", title: "Formateur", bio: "", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" },
          objectives: course.objectives || [
            locale === "fr" ? "Maitriser les concepts fondamentaux" : "Master the core concepts",
            locale === "fr" ? "Developper des competences pratiques" : "Build practical skills",
            locale === "fr" ? "Obtenir une certification reconnue" : "Earn a recognized certificate",
          ],
          prerequisites: course.prerequisites || [
            locale === "fr" ? "Aucun prerequis academique requis" : "No academic prerequisites required",
            locale === "fr" ? "Acces internet stable" : "Stable internet access",
          ],
          audience: course.audience || [
            locale === "fr" ? "Leaders spirituels en formation" : "Spiritual leaders in training",
            locale === "fr" ? "Toute personne desirant grandir" : "Anyone wishing to grow",
          ],
          certification: course.certification || "Certificat LL Academie",
          stats: { students: course._count?.enrollments || 0, rating: 4.8, completion: 90 },
          testimonials: formationsData[slug]?.testimonials || [],
        };
        setFormation(apiFormation);
      })
      .catch(() => {
        if (!formationsData[slug]) setFormation(null);
      })
      .finally(() => setLoading(false));
  }, [slug, locale]);

  useEffect(() => {
    if (user && slug) {
      api.get<{ enrolled: boolean }>(`/enrollments/check/${slug}`)
        .then((res) => setAlreadyEnrolled(res.enrolled))
        .catch(() => {});
    }
  }, [user, slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="text-gold text-3xl animate-spin" />
      </div>
    );
  }

  if (!formation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cream mb-4">Formation introuvable</h1>
          <p className="text-cream/50 mb-8">Cette formation n&apos;existe pas ou a ete deplacee.</p>
          <Link href="/formations"><Button>Voir toutes les formations</Button></Link>
        </div>
      </div>
    );
  }

  const totalLessons = formation.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const freeLessons = formation.modules.reduce((sum, m) => sum + m.lessons.filter(l => l.free).length, 0);

  const priceNum = formation ? parseFloat(formation.price?.replace(/[^0-9.]/g, "") || "0") : 0;

  const handleEnroll = async () => {
    if (!user) { router.push("/connexion"); return; }
    if (priceNum > 0) { setShowPayment(true); return; }
    setEnrolling(true);
    try {
      await api.post(`/enrollments/${slug}`);
      setEnrollToast({ msg: locale === "fr" ? "Inscription reussie ! Redirection..." : "Enrolled! Redirecting...", type: "success" });
      setTimeout(() => router.push("/dashboard/formations"), 1500);
    } catch (err: any) {
      const msg = err?.message?.includes("Deja inscrit")
        ? (locale === "fr" ? "Vous etes deja inscrit a cette formation" : "Already enrolled in this course")
        : (locale === "fr" ? "Erreur lors de l'inscription" : "Enrollment failed");
      setEnrollToast({ msg, type: "error" });
      setTimeout(() => setEnrollToast(null), 4000);
    } finally {
      setEnrolling(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      await api.post(`/enrollments/${slug}`);
    } catch {}
    setAlreadyEnrolled(true);
    setShowPayment(false);
    setEnrollToast({ msg: locale === "fr" ? "Paiement reussi ! Redirection..." : "Payment successful! Redirecting...", type: "success" });
    setTimeout(() => router.push("/dashboard/formations"), 1500);
  };

  return (
    <>
      <AnimatePresence>
        {enrollToast && (
          <motion.div initial={{ opacity: 0, y: -30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
              enrollToast.type === "success" ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400" : "bg-red-500/15 border-red-500/20 text-red-400"
            }`}>
            {enrollToast.type === "success" ? <FaCheckCircle /> : <FaTimes />}
            <span className="text-sm font-medium">{enrollToast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src={formation.image} alt={formation.title} fill className="object-cover" priority sizes="100vw" />
          <div className={`absolute inset-0 bg-gradient-to-t ${formation.gradient}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-12 pt-32 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Link href="/formations" className="inline-flex items-center gap-2 text-cream/50 hover:text-gold text-sm mb-6 transition-colors">
              <FaArrowLeft className="text-xs" /> {locale === "fr" ? "Retour aux formations" : "Back to courses"}
            </Link>
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge variant="gold">{formation.level}</Badge>
              <Badge><FaClock className="inline mr-1 text-[10px]" />{formation.duration}</Badge>
              <Badge><FaBookOpen className="inline mr-1 text-[10px]" />{formation.modules.length} modules — {totalLessons} lecons</Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-cream mb-4 leading-tight max-w-3xl">{formation.title}</h1>
            <p className="text-lg text-cream/60 max-w-2xl mb-8">{formation.subtitle}</p>
            <div className="flex flex-wrap items-center gap-6">
              {alreadyEnrolled ? (
                <div className="space-y-2">
                  <Button size="lg" className="opacity-50 cursor-not-allowed w-full" disabled>
                    {locale === "fr" ? "Deja inscrit" : "Already enrolled"}
                  </Button>
                  <p className="text-emerald-400 text-xs text-center flex items-center justify-center gap-1.5"><FaCheckCircle className="text-[10px]" />{locale === "fr" ? "Vous etes deja inscrit a cette formation" : "You are already enrolled in this course"}</p>
                  <Link href="/dashboard/formations" className="block text-center text-gold text-xs hover:underline mt-1">{locale === "fr" ? "Acceder a mes formations" : "Go to my courses"} →</Link>
                </div>
              ) : (
              <Button size="lg" className="shadow-2xl shadow-gold/30" onClick={handleEnroll} disabled={enrolling}>
                  {enrolling ? <><FaSpinner className="animate-spin mr-2" /> {locale === "fr" ? "Inscription..." : "Enrolling..."}</> :
                    formation.price === "Sur devis" ? (locale === "fr" ? "Postuler maintenant" : "Apply now") : `${locale === "fr" ? "S'inscrire" : "Enroll"} — ${formation.price} $`}
              </Button>
              )}
              <div className="flex items-center gap-4 text-cream/50 text-sm">
                <span className="flex items-center gap-1"><FaUsers /> {formation.stats.students} {locale === "fr" ? "inscrits" : "enrolled"}</span>
                <span className="flex items-center gap-1"><FaStar className="text-gold" /> {formation.stats.rating}/5</span>
                <span className="flex items-center gap-1"><FaGraduationCap /> {formation.stats.completion}% {locale === "fr" ? "de completion" : "completion"}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-16">
            <AnimatedSection>
              <h2 className="text-2xl font-bold text-cream mb-6">{locale === "fr" ? "A propos de cette formation" : "About this course"}</h2>
              <p className="text-cream/60 leading-relaxed text-base">{formation.description}</p>
            </AnimatedSection>

            <AnimatedSection>
              <h2 className="text-2xl font-bold text-cream mb-6">{locale === "fr" ? "Ce que vous apprendrez" : "What you\u0027ll learn"}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {formation.objectives.map((obj, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-cream/[0.02] border border-cream/[0.05]">
                    <FaCheckCircle className="text-gold mt-1 flex-shrink-0" />
                    <span className="text-cream/70 text-sm leading-relaxed">{obj}</span>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <h2 className="text-2xl font-bold text-cream mb-2">
                {locale === "fr" ? "Programme detaille" : "Detailed curriculum"}
              </h2>
              <p className="text-cream/40 text-sm mb-6">
                {formation.modules.length} modules — {totalLessons} lecons — {freeLessons} {locale === "fr" ? "lecons gratuites" : "free lessons"}
              </p>
              <div className="space-y-3">
                {formation.modules.map((mod, mi) => (
                  <motion.div key={mi} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    className="rounded-xl border border-cream/[0.06] overflow-hidden">
                    <button onClick={() => setOpenModule(openModule === mi ? -1 : mi)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-cream/[0.02] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold font-bold text-sm">{mi + 1}</div>
                        <div>
                          <h3 className="text-cream font-semibold text-sm">{mod.title}</h3>
                          <p className="text-cream/30 text-xs mt-0.5">{mod.lessons.length} lecons</p>
                        </div>
                      </div>
                      {openModule === mi ? <FaChevronUp className="text-cream/30 text-xs" /> : <FaChevronDown className="text-cream/30 text-xs" />}
                    </button>
                    {openModule === mi && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="border-t border-cream/[0.04]">
                        {mod.lessons.map((lesson, li) => (
                          <div key={li} className="flex items-center justify-between px-6 py-3 hover:bg-cream/[0.015] transition-colors">
                            <div className="flex items-center gap-3">
                              {lesson.free || alreadyEnrolled ? <FaPlay className="text-gold text-[10px]" /> : <FaLock className="text-cream/20 text-[10px]" />}
                              <span className={`text-sm ${lesson.free || alreadyEnrolled ? "text-cream/70" : "text-cream/40"}`}>{lesson.title}</span>
                              {lesson.free && <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-gold/10 text-gold uppercase">Gratuit</span>}
                            </div>
                            <span className="text-cream/25 text-xs">{lesson.duration}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <h2 className="text-2xl font-bold text-cream mb-6">{locale === "fr" ? "Temoignages" : "Testimonials"}</h2>
              <div className="space-y-6">
                {formation.testimonials.map((t, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="p-6 rounded-2xl bg-cream/[0.02] border border-cream/[0.06]">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(t.rating)].map((_, s) => <FaStar key={s} className="text-gold text-sm" />)}
                    </div>
                    <p className="text-cream/60 text-sm leading-relaxed italic mb-4">&ldquo;{t.text}&rdquo;</p>
                    <div>
                      <div className="text-cream font-semibold text-sm">{t.name}</div>
                      <div className="text-cream/30 text-xs">{t.role}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-cream/[0.06] overflow-hidden bg-cream/[0.01]">
                <div className="p-6 border-b border-cream/[0.04]">
                  <div className="text-3xl font-bold text-gold mb-1">
                    {formation.price === "Sur devis" ? "Sur devis" : `${formation.price} $`}
                  </div>
                  <p className="text-cream/30 text-xs">{locale === "fr" ? "Acces a vie inclus" : "Lifetime access included"}</p>
                </div>
                <div className="p-6 space-y-4">
                  {alreadyEnrolled ? (
                    <div className="space-y-2">
                      <Button className="w-full opacity-50 cursor-not-allowed" size="lg" disabled>
                        {locale === "fr" ? "Deja inscrit" : "Already enrolled"}
                      </Button>
                      <Link href="/dashboard/formations" className="block text-center text-gold text-xs hover:underline">{locale === "fr" ? "Voir mes formations" : "My courses"} →</Link>
                    </div>
                  ) : (
                    <Button className="w-full" size="lg" onClick={handleEnroll} disabled={enrolling}>
                      {enrolling ? <FaSpinner className="animate-spin" /> : formation.price === "Sur devis" ? (locale === "fr" ? "Postuler" : "Apply") : (locale === "fr" ? "S'inscrire maintenant" : "Enroll now")}
                    </Button>
                  )}
                  <div className="space-y-3 text-sm">
                    {[
                      { icon: FaBookOpen, text: `${formation.modules.length} modules — ${totalLessons} lecons` },
                      { icon: FaClock, text: formation.duration },
                      { icon: FaCertificate, text: locale === "fr" ? "Certificat inclus" : "Certificate included" },
                      { icon: FaGlobe, text: locale === "fr" ? "Acces 24/7 en ligne" : "24/7 online access" },
                      { icon: FaLaptop, text: locale === "fr" ? "Sessions live hebdomadaires" : "Weekly live sessions" },
                      { icon: FaCalendarAlt, text: locale === "fr" ? "A votre rythme" : "Self-paced" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-cream/50">
                        <item.icon className="text-gold text-xs flex-shrink-0" />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-cream/[0.06] p-6 bg-cream/[0.01]">
                <h3 className="text-cream font-semibold text-sm mb-4">{locale === "fr" ? "Votre formateur" : "Your instructor"}</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden relative">
                    <Image src={formation.instructor.image} alt={formation.instructor.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div>
                    <div className="text-cream font-semibold text-sm">{formation.instructor.name}</div>
                    <div className="text-cream/30 text-xs">{formation.instructor.title}</div>
                  </div>
                </div>
                <p className="text-cream/40 text-xs leading-relaxed">{formation.instructor.bio}</p>
              </div>

              <div className="rounded-2xl border border-cream/[0.06] p-6 bg-cream/[0.01]">
                <h3 className="text-cream font-semibold text-sm mb-3">{locale === "fr" ? "Prerequis" : "Prerequisites"}</h3>
                <ul className="space-y-2">
                  {formation.prerequisites.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-cream/40 text-xs">
                      <FaCheckCircle className="text-cream/20 mt-0.5 flex-shrink-0 text-[10px]" /> {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-cream/[0.06] p-6 bg-cream/[0.01]">
                <h3 className="text-cream font-semibold text-sm mb-3">{locale === "fr" ? "Public cible" : "Target audience"}</h3>
                <ul className="space-y-2">
                  {formation.audience.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-cream/40 text-xs">
                      <FaUserTie className="text-gold mt-0.5 flex-shrink-0 text-[10px]" /> {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {formation && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
          courseId={slug}
          courseTitle={formation.title}
          amount={priceNum}
          currency="USD"
        />
      )}
    </>
  );
}
