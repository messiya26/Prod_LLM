"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaClock, FaArrowLeft, FaShare, FaFacebook, FaTwitter, FaWhatsapp, FaBookOpen, FaArrowRight } from "react-icons/fa";

const articlesData: Record<string, { title: string; category: string; date: string; readTime: string; image: string; content: string[]; relatedSlugs: string[] }> = {
  "les-tenebres-de-dieu-comprendre-les-saisons-obscures": {
    title: "Les Tenebres de Dieu : comprendre les saisons obscures de votre vie",
    category: "Vie Chretienne",
    date: "25 Fevrier 2026",
    readTime: "12 min",
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200&h=600&fit=crop",
    content: [
      "Pourquoi Dieu permet-Il les epreuves ? C'est la question que des millions de croyants se posent chaque jour. Dans son ouvrage revelateur 'Les Tenebres de Dieu : Le Processus Qui Conduit A La Grandeur', Lord Lombo apporte une perspective biblique profonde et personnelle sur cette question universelle.",
      "\"Les tenebres ne sont pas l'absence de Dieu\", ecrit Lord Lombo dans le premier chapitre. \"Elles sont le lieu secret ou Il forge les grands leaders. C'est dans l'obscurite que Dieu prepare la lumiere qui eclairera les nations.\"",
      "Le livre s'appuie sur les experiences personnelles de l'auteur — la perte de sa mere a l'age de 9 ans, les annees de formation spirituelle intense, et les defis du ministere — pour illustrer comment chaque epreuve est en realite un outil divin de transformation.",
      "Lord Lombo identifie 5 phases dans le processus des tenebres divines : l'Isolement (ou Dieu vous separe pour vous parler), la Confrontation (ou vos faiblesses sont mises a nu), la Purification (ou Dieu brule les impuretes), la Revelation (ou vous comprenez le plan divin), et enfin l'Elevation (ou vous emergez plus fort qu'avant).",
      "L'un des passages les plus marquants du livre traite de Joseph dans la Genese : \"Joseph n'est pas devenu Premier Ministre d'Egypte MALGRE la fosse et la prison. Il l'est devenu A CAUSE de la fosse et de la prison. Chaque tenebres etait une preparation.\"",
      "Ce message resonne particulierement dans le contexte africain et dans la diaspora, ou tant de croyants traversent des saisons difficiles. Lord Lombo nous rappelle que ces saisons ont un but et une fin. Comme le dit le Psaume 30:5 : \"Le soir arrivent les pleurs, et le matin l'allegresse.\"",
      "Le livre, disponible sur Amazon en format physique et numerique, a deja touche des milliers de lecteurs a travers le monde. Il est devenu un outil de reference pour de nombreux pasteurs et leaders chretiens dans leur accompagnement spirituel.",
    ],
    relatedSlugs: ["gerer-epreuves-avec-foi", "7-piliers-leadership-pastoral-biblique", "puissance-louange-combat-spirituel"],
  },
  "7-piliers-leadership-pastoral-biblique": {
    title: "Les 7 piliers du leadership pastoral selon la Bible",
    category: "Leadership",
    date: "20 Fevrier 2026",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&h=600&fit=crop",
    content: [
      "Le leadership pastoral est un appel sacre qui exige bien plus que du charisme ou de l'eloquence. Il repose sur des fondements bibliques immuables que Lord Lombo enseigne a travers l'Academie et ses nombreuses conferences.",
      "Premier pilier : L'Integrite. Un pasteur doit etre irreprochable dans sa conduite personnelle. Comme Paul l'ecrit a Timothee : \"Veille sur toi-meme et sur ton enseignement.\" L'integrite n'est pas la perfection, mais la transparence devant Dieu et les hommes.",
      "Deuxieme pilier : La Vision. Sans vision, le peuple perit (Proverbes 29:18). Un leader pastoral doit avoir une vision claire de la direction que Dieu veut donner a son ministere et savoir la communiquer avec clarte et passion.",
      "Troisieme pilier : La Priere. La priere n'est pas une activite parmi d'autres pour le leader pastoral, c'est LE fondement de tout. Jesus lui-meme se retirait regulierement pour prier. Un pasteur qui ne prie pas est un soldat desarme.",
      "Quatrieme pilier : L'Enseignement. Le pasteur est avant tout un enseignant de la Parole. Il doit etudier avec diligence, interpreter avec justesse et appliquer avec sagesse les Ecritures saintes.",
      "Cinquieme pilier : La Compassion. Jesus etait emu de compassion en voyant les foules. Le leader pastoral doit avoir un coeur de berger, sensible aux besoins, aux souffrances et aux espoirs de ses brebis.",
      "Sixieme pilier : La Formation. Un bon leader forme d'autres leaders. Lord Lombo insiste sur ce point : \"Le succes d'un ministere ne se mesure pas au nombre de personnes qui vous suivent, mais au nombre de leaders que vous avez formes.\"",
      "Septieme pilier : L'Humilite. Le plus grand parmi vous sera votre serviteur. L'humilite n'est pas la faiblesse — c'est la force de reconnaitre que tout vient de Dieu et que sans Lui, nous ne pouvons rien faire.",
    ],
    relatedSlugs: ["batir-equipe-ministerielle-efficace", "les-tenebres-de-dieu-comprendre-les-saisons-obscures", "de-kinshasa-au-monde-parcours-lord-lombo"],
  },
  "comment-emmanuel-a-change-ma-vie": {
    title: "Comment le chant 'Emmanuel' a change des millions de vies",
    category: "Temoignages",
    date: "18 Fevrier 2026",
    readTime: "10 min",
    image: "https://i.ytimg.com/vi/84Bq-Yw6UxU/maxresdefault.jpg",
    content: [
      "En 2017, Lord Lombo publie un single qui va bouleverser le paysage du gospel francophone : 'Emmanuel', featuring Sandra Mbuyi et Gamaliel Lombo. Personne ne pouvait predire l'impact phenomenal de ce chant qui cumule aujourd'hui plus de 23 millions de vues sur YouTube.",
      "\"Emmanuel n'est pas un chant que j'ai compose\", confie Lord Lombo. \"C'est un chant que j'ai recu. Je me souviens de cette nuit ou la melodie est venue pendant un moment de priere intense. Les paroles ont coule comme une riviere.\"",
      "Le chant est devenu bien plus qu'un succes musical. Des temoignages affluent du monde entier : guerisons, delivrances, reconciliations, conversions. A Kinshasa, une femme raconte comment elle ecoutait Emmanuel en boucle pendant sa chimio. A Paris, un jeune homme a retrouve la foi apres des annees d'eloignement en entendant ce chant dans le metro.",
      "Sandra Mbuyi, qui prête sa voix au morceau, partage : \"Chaque fois que je chante Emmanuel, je sens la presence de Dieu de maniere tangible. Ce n'est pas juste un chant, c'est un portail vers Sa presence.\"",
      "Le clip video, tourne a Kinshasa, est devenu emblematique du gospel congolais moderne. La simplicite de la mise en scene — trois voix, une atmosphere de priere — contraste avec la puissance de l'impact spirituel.",
      "Au-dela des chiffres, Emmanuel a ouvert des portes internationales pour le ministere de Lord Lombo. Invitations dans plus de 50 pays, collaborations avec des artistes du monde entier, et surtout, des millions de vies touchees par la presence de Dieu.",
      "Aujourd'hui, Emmanuel est chante dans des milliers d'eglises a travers le monde, traduit en plusieurs langues, et reste le chant le plus demande lors des concerts de Lord Lombo. Comme le dit souvent l'artiste : \"Ce chant ne m'appartient pas. Il appartient a Dieu et a Son peuple.\"",
    ],
    relatedSlugs: ["ecrire-un-chant-qui-touche-les-coeurs", "puissance-louange-combat-spirituel", "de-kinshasa-au-monde-parcours-lord-lombo"],
  },
  "puissance-louange-combat-spirituel": {
    title: "La puissance de la louange dans le combat spirituel",
    category: "Predications",
    date: "15 Fevrier 2026",
    readTime: "9 min",
    image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=1200&h=600&fit=crop",
    content: [
      "La louange est une arme spirituelle d'une puissance insoupconnee. Dans 2 Chroniques 20, le roi Josaphat envoie les chantres DEVANT l'armee. Pas derriere. Devant. La louange ouvre le chemin de la victoire.",
      "Lord Lombo enseigne que la louange opere sur trois niveaux dans le combat spirituel. Le premier niveau est la louange de reconnaissance : remercier Dieu pour ce qu'Il a deja fait. C'est le fondement qui ancre notre foi dans les faits accomplis de Dieu.",
      "Le deuxieme niveau est la louange prophetique : louer Dieu pour ce qu'Il va faire, meme si on ne le voit pas encore. C'est la foi en action. Comme Abraham qui a loue Dieu pour Isaac alors que Sara etait sterile.",
      "Le troisieme niveau est la louange sacrificielle : louer Dieu malgre les circonstances, meme quand tout s'effondre. C'est le niveau le plus puissant, celui ou Paul et Silas chantent en prison a minuit et les chaines tombent.",
      "\"Quand vous louez Dieu dans les tenebres\", declare Lord Lombo, \"vous declarez au monde spirituel que votre foi est plus grande que votre douleur. Et c'est a ce moment que les chaines se brisent.\"",
      "Pratiquement, Lord Lombo recommande d'integrer la louange dans votre routine quotidienne — pas seulement le dimanche. 15 minutes de louange chaque matin transforment l'atmosphere de votre journee et de votre foyer.",
      "La louange n'est pas reservee aux musiciens. Chaque croyant est appele a louer. Avec ou sans instrument, avec ou sans voix melodieuse. Ce qui compte, c'est la sincerite du coeur et la determination de glorifier Dieu en toute circonstance.",
    ],
    relatedSlugs: ["comment-emmanuel-a-change-ma-vie", "gerer-epreuves-avec-foi", "ecrire-un-chant-qui-touche-les-coeurs"],
  },
  "batir-equipe-ministerielle-efficace": {
    title: "Batir une equipe ministerielle efficace : guide pratique",
    category: "Leadership",
    date: "10 Fevrier 2026",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=600&fit=crop",
    content: [
      "Une eglise forte repose sur une equipe ministerielle soudee et bien structuree. Lord Lombo, a travers ses annees de ministere et la direction de Lord Lombo Ministries, partage les principes cles pour constituer une equipe qui porte du fruit.",
      "Principe 1 : Choisir par le caractere, pas par le talent. Judas etait talentueux mais son caractere l'a perdu. Le talent peut se developper, mais le caractere doit deja etre present — integrite, fiabilite, humilite.",
      "Principe 2 : Definir clairement les roles. Chaque membre doit savoir exactement ce qui est attendu de lui. L'ambiguite dans les roles cree des conflits et de la frustration. Paul le montre dans 1 Corinthiens 12 : chaque membre du corps a une fonction precise.",
      "Principe 3 : Investir dans la formation continue. Une equipe qui ne grandit pas stagne puis decline. Prevoir des temps reguliers de formation, de lecture, et d'echange entre leaders.",
      "Principe 4 : Communiquer avec transparence. Les non-dits detruisent les equipes. Instaurez une culture de communication ouverte ou chacun peut s'exprimer sans crainte.",
      "Principe 5 : Celebrer les victoires ensemble. Ne soyez pas avare de reconnaissance. Chaque avancee, meme petite, merite d'etre celebree. Cela renforce la cohesion et la motivation.",
      "Lord Lombo conclut : \"L'equipe n'est pas un luxe pour le ministere, c'est une necessite biblique. Meme Jesus a choisi 12 disciples. Personne n'est appele a accomplir seul la vision de Dieu.\"",
    ],
    relatedSlugs: ["7-piliers-leadership-pastoral-biblique", "de-kinshasa-au-monde-parcours-lord-lombo", "les-tenebres-de-dieu-comprendre-les-saisons-obscures"],
  },
  "de-kinshasa-au-monde-parcours-lord-lombo": {
    title: "De Kinshasa au monde : le parcours inspire de Lord Lombo",
    category: "Temoignages",
    date: "5 Fevrier 2026",
    readTime: "15 min",
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&h=600&fit=crop",
    content: [
      "Ne le 8 juin 1989 a Kinshasa en Republique Democratique du Congo, Magloire Lord Lombo Mawaba est le troisieme enfant d'une famille chretienne de cinq. Son pere etant pasteur et sa mere servante du Tres-Haut, Lord a baigne dans la Parole de Dieu des son plus jeune age.",
      "La perte de sa mere alors qu'il n'a que 9 ans marque un tournant dans sa vie. Un an plus tard, lors d'une campagne d'evangelisation organisee par son pere a la chapellerie IBTP de Ngaliema, un predicateur venu de France lance un appel au salut. Le jeune Lord repond a cet appel et donne officiellement sa vie a Christ.",
      "Les annees qui suivent sont des annees de formation intense. Lord apprend la musique, etudie la theologie, et commence a precher dans de petites assemblees. Son talent pour l'ecriture se manifeste tres tot — il compose ses premiers chants a l'adolescence.",
      "L'annee 2017 marque l'explosion avec la sortie de l'album 'Immanouel' et du single 'Emmanuel' featuring Sandra Mbuyi et Gamaliel Lombo. Le titre cumule rapidement des millions de vues et fait connaitre Lord Lombo bien au-dela des frontieres congolaises.",
      "Les albums suivants — 'Extr'aime' (2020) avec les hits 'Amoureux' et 'Saison', puis 'C.H.A' (2023) avec 'Tant que tu donnes un chant' — confirment son statut d'artiste incontournable du gospel francophone.",
      "Parallelement a la musique, Lord Lombo publie son premier livre 'Les Tenebres de Dieu' qui devient rapidement un best-seller dans la communaute chretienne francophone. L'ouvrage explore les saisons difficiles comme des instruments de preparation divine.",
      "En 2025, il lance Lord Lombo Ministries (LLM), une plateforme multisite qui regroupe l'ensemble de ses activites : musique, livres, formations a travers Lord Lombo Academie, evenements et coaching. Le ministere touche aujourd'hui plus de 50 pays.",
      "Lord Lombo est membre de la famille Philadelphia et a collabore avec de grands artistes de notre epoque. Sa vision : impacter les nations a travers un ministere multidimensionnel — musique, enseignement, ecriture et coaching.",
    ],
    relatedSlugs: ["comment-emmanuel-a-change-ma-vie", "les-tenebres-de-dieu-comprendre-les-saisons-obscures", "7-piliers-leadership-pastoral-biblique"],
  },
  "ecrire-un-chant-qui-touche-les-coeurs": {
    title: "Comment ecrire un chant qui touche les coeurs",
    category: "Musique",
    date: "1 Fevrier 2026",
    readTime: "11 min",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=1200&h=600&fit=crop",
    content: [
      "Ecrire un chant qui marque les generations n'est pas une question de technique musicale. C'est d'abord une question de connexion spirituelle. Lord Lombo, auteur de chants qui cumulent plus de 100 millions de vues, partage les cles de son processus creatif.",
      "\"Tout commence par l'ecoute\", explique Lord Lombo. \"Avant d'ecrire un seul mot, je passe du temps en priere et en meditation. Le Saint-Esprit est le meilleur compositeur. Mon role est de capter ce qu'Il dit et de le traduire en musique.\"",
      "La sincerite est non-negociable. Les gens reconnaissent l'authenticite. Un chant ecrit pour impressionner ne touchera jamais comme un chant ecrit depuis les profondeurs du vecu. 'Emmanuel' est ne d'un moment de priere sincere, pas d'une session de studio planifiee.",
      "Lord Lombo recommande de puiser dans les Psaumes. David etait le plus grand songwriter de l'histoire biblique. Ses psaumes couvrent toute la gamme des emotions humaines — la joie, la douleur, la colere, l'esperance, l'adoration pure.",
      "La simplicite est une force. Les chants les plus puissants sont souvent les plus simples. 'Emmanuel, Emmanuel, Emmanuel...' — la repetition du nom de Dieu cree une atmosphere de priere collective que des paroles complexes ne pourraient jamais produire.",
      "Ensuite vient l'arrangement musical. Lord Lombo travaille avec des musiciens talentueux pour habiller la melodie d'harmonies qui servent le message. La musique ne doit jamais prendre le dessus sur les paroles — elle doit les porter.",
      "Enfin, il faut oser partager. Beaucoup de chants extraordinaires ne verront jamais le jour parce que leurs auteurs n'osent pas les presenter. \"Le chant n'est pas pour vous\", rappelle Lord Lombo. \"Il est pour ceux qui ont besoin de l'entendre. Ne le gardez pas pour vous.\"",
    ],
    relatedSlugs: ["comment-emmanuel-a-change-ma-vie", "puissance-louange-combat-spirituel", "de-kinshasa-au-monde-parcours-lord-lombo"],
  },
  "gerer-epreuves-avec-foi": {
    title: "Gerer les epreuves avec foi : lecons du livre de Job",
    category: "Vie Chretienne",
    date: "28 Janvier 2026",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&h=400&fit=crop",
    content: [
      "Le livre de Job est peut-etre le texte biblique le plus profond sur la question de la souffrance. Job, un homme integre et droit, perd tout en un instant — ses biens, ses enfants, sa sante. Pourtant, il refuse de maudire Dieu.",
      "Lord Lombo, dans ses enseignements, souligne trois lecons fondamentales de l'histoire de Job.",
      "Premiere lecon : La souffrance n'est pas toujours une punition. Les amis de Job etaient convaincus qu'il avait peche. Mais Dieu lui-meme declare Job integre. Parfois, les epreuves ne sont pas la consequence de nos erreurs mais le creuset de notre elevation.",
      "Deuxieme lecon : Dieu est souverain, meme dans le silence. Pendant 37 chapitres, Dieu ne dit rien. Job crie, questionne, pleure — et le ciel semble vide. Mais le silence de Dieu n'est pas Son absence. Il prepare une reponse qui depasse toute comprehension.",
      "Troisieme lecon : La restauration depasse toujours la perte. A la fin, Job recoit le double de tout ce qu'il avait perdu. Dieu ne restaure pas simplement — Il multiplie. \"Et l'Eternel restaura Job dans son premier etat, et il lui accorda le double de tout ce qu'il avait possede.\" (Job 42:10)",
      "Comment appliquer ces lecons aujourd'hui ? Lord Lombo propose trois pratiques : Premierement, maintenir la priere quotidienne meme quand on n'a pas envie. Deuxiemement, s'entourer de personnes de foi (pas des 'amis de Job' qui condamnent). Troisiemement, se rappeler les delivrances passees — si Dieu l'a fait avant, Il le fera encore.",
      "En conclusion, l'epreuve n'est jamais le dernier chapitre. Comme le dit Lord Lombo dans 'Les Tenebres de Dieu' : \"Votre histoire ne finit pas dans les tenebres. Les tenebres ne sont qu'un chapitre, pas le livre entier.\"",
    ],
    relatedSlugs: ["les-tenebres-de-dieu-comprendre-les-saisons-obscures", "puissance-louange-combat-spirituel", "7-piliers-leadership-pastoral-biblique"],
  },
};

const allArticles = Object.entries(articlesData).map(([slug, data]) => ({ slug, ...data }));

export default function ArticlePage() {
  const { slug } = useParams() as { slug: string };
  const article = articlesData[slug];

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-serif font-bold text-cream mb-4">Article non trouve</h1>
        <p className="text-cream/35 mb-8">Cet article n&apos;existe pas ou a ete deplace.</p>
        <Link href="/blog" className="px-8 py-3 rounded-full bg-gradient-to-r from-gold to-gold-light text-navy-deep font-bold text-sm">Retour au blog</Link>
      </div>
    );
  }

  const related = article.relatedSlugs.map((s) => allArticles.find((a) => a.slug === s)).filter(Boolean);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image src={article.image} alt={article.title} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-dark/30" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/blog" className="flex items-center gap-2 text-cream/40 text-xs hover:text-gold transition-all"><FaArrowLeft className="text-[10px]" /> Blog</Link>
            <span className="text-cream/10">|</span>
            <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-medium">{article.category}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-cream leading-tight mb-4">{article.title}</h1>
          <div className="flex items-center gap-4 text-cream/30 text-xs">
            <span className="flex items-center gap-1.5"><FaCalendarAlt className="text-[10px]" /> {article.date}</span>
            <span className="flex items-center gap-1.5"><FaClock className="text-[10px]" /> {article.readTime} de lecture</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Share bar */}
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-cream/[0.06]">
            <span className="text-cream/20 text-xs mr-2"><FaShare className="inline text-[10px]" /> Partager :</span>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-cream/25 hover:text-blue-400 hover:border-blue-400/20 transition-all"><FaFacebook className="text-xs" /></a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener" className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-cream/25 hover:text-sky-400 hover:border-sky-400/20 transition-all"><FaTwitter className="text-xs" /></a>
            <a href={`https://wa.me/?text=${encodeURIComponent(article.title + " " + shareUrl)}`} target="_blank" rel="noopener" className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-cream/25 hover:text-green-400 hover:border-green-400/20 transition-all"><FaWhatsapp className="text-xs" /></a>
          </div>

          {/* Article body */}
          <article className="space-y-6">
            {article.content.map((paragraph, i) => {
              if (paragraph.startsWith("\"") && paragraph.endsWith("\"")) {
                return (
                  <blockquote key={i} className="border-l-2 border-gold/30 pl-6 py-2 my-8">
                    <p className="text-cream/60 text-lg font-serif italic leading-relaxed">{paragraph}</p>
                  </blockquote>
                );
              }
              return (
                <p key={i} className="text-cream/50 text-base leading-[1.85] font-light">{paragraph}</p>
              );
            })}
          </article>

          {/* Author */}
          <div className="mt-14 p-6 rounded-2xl glass-card flex items-center gap-5">
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gold/20">
              <Image src="/images/lord-lombo.jpeg" alt="Lord Lombo" width={64} height={64} className="object-cover w-full h-full" />
            </div>
            <div>
              <div className="text-gold font-bold text-sm">Lord Lombo</div>
              <div className="text-cream/25 text-xs mt-0.5">Pasteur, Chantre, Ecrivain & Fondateur de Lord Lombo Ministries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="py-14 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-serif font-bold text-cream mb-6">Articles <span className="text-gradient-gold">similaires</span></h2>
            <div className="grid md:grid-cols-3 gap-5">
              {related.map((r) => r && (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="group rounded-2xl overflow-hidden glass-card hover:border-gold/15 transition-all">
                  <div className="h-36 relative overflow-hidden">
                    <Image src={r.image} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="400px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/70 to-transparent" />
                  </div>
                  <div className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-gold/10 text-gold text-[9px] font-medium">{r.category}</span>
                    <h3 className="text-cream font-bold text-sm mt-2 group-hover:text-gold transition-colors leading-snug">{r.title}</h3>
                    <div className="text-cream/15 text-[10px] mt-1">{r.readTime}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card rounded-2xl p-10">
            <FaBookOpen className="text-gold/20 text-3xl mb-4 mx-auto" />
            <h3 className="text-cream font-serif font-bold text-xl mb-2">Envie d&apos;aller plus loin ?</h3>
            <p className="text-cream/30 text-sm mb-6">Decouvrez les formations de l&apos;Academie Lord Lombo pour approfondir votre leadership et votre foi.</p>
            <div className="flex items-center justify-center gap-4">
              <a href="https://www.amazon.fr/T%C3%A9n%C3%A8bres-Dieu-Processus-Conduit-Grandeur/dp/0692756914" target="_blank" rel="noopener" className="px-6 py-3 rounded-full bg-gradient-to-r from-gold to-gold-light text-navy-deep font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all">Acheter le livre</a>
              <Link href="https://lord-lombo-academie.vercel.app/formations" className="px-6 py-3 rounded-full border border-cream/10 text-cream/50 text-sm hover:border-gold/30 hover:text-gold transition-all">Voir les formations</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
