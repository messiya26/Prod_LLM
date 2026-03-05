import { PrismaClient } from ".prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash("Admin2026!", 12);
  const studentHash = await bcrypt.hash("Student2026!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@lordlomboacademie.com" },
    update: { firstName: "Lord", lastName: "Lombo", bio: "Pasteur, chanteur, auteur et visionnaire du ministere Lord Lombo Ministries. Connu pour ses ecrits inspires et son single a succes Emmanuel." },
    create: {
      email: "admin@lordlomboacademie.com",
      passwordHash: adminHash,
      firstName: "Lord",
      lastName: "Lombo",
      bio: "Pasteur, chanteur, auteur et visionnaire du ministere Lord Lombo Ministries. Connu pour ses ecrits inspires et son single a succes Emmanuel.",
      role: "ADMIN",
      emailVerified: true,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "jean@demo.com" },
    update: {},
    create: {
      email: "jean@demo.com",
      passwordHash: studentHash,
      firstName: "Jean",
      lastName: "Kisula",
      role: "STUDENT",
      emailVerified: true,
    },
  });

  const instructorHash = await bcrypt.hash("Instructor2026!", 12);
  const instructor1 = await prisma.user.upsert({
    where: { email: "pasteur.mukendi@llacademie.com" },
    update: {},
    create: {
      email: "pasteur.mukendi@llacademie.com",
      passwordHash: instructorHash,
      firstName: "Pasteur",
      lastName: "Mukendi",
      role: "INSTRUCTOR",
      bio: "Pasteur et enseignant avec plus de 15 ans d'experience dans le ministere pastoral.",
      emailVerified: true,
    },
  });

  const instructor2 = await prisma.user.upsert({
    where: { email: "sarah.mbuyi@llacademie.com" },
    update: {},
    create: {
      email: "sarah.mbuyi@llacademie.com",
      passwordHash: instructorHash,
      firstName: "Sarah",
      lastName: "Mbuyi",
      role: "INSTRUCTOR",
      bio: "Formatrice en leadership et communication, specialisee dans le coaching ministeriel.",
      emailVerified: true,
    },
  });

  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "leadership-pastoral" }, update: {}, create: { name: "Leadership Pastoral", slug: "leadership-pastoral" } }),
    prisma.category.upsert({ where: { slug: "musique-louange" }, update: {}, create: { name: "Musique & Louange", slug: "musique-louange" } }),
    prisma.category.upsert({ where: { slug: "formation-biblique" }, update: {}, create: { name: "Formation Biblique", slug: "formation-biblique" } }),
    prisma.category.upsert({ where: { slug: "communication" }, update: {}, create: { name: "Communication & Media", slug: "communication" } }),
  ]);

  const courses = [
    { title: "Fondements de la Foi et du Leadership", slug: "fondements-foi-leadership", description: "Un parcours complet pour comprendre et exercer le leadership pastoral avec excellence.", level: "ALL_LEVELS" as const, price: 149, published: true, categoryId: categories[0].id, instructorId: instructor1.id },
    { title: "Leadership et Vision Ministerielle", slug: "leadership-vision-ministerielle", description: "Developper une vision claire et impactante pour votre ministere.", level: "INTERMEDIATE" as const, price: 199, published: true, categoryId: categories[0].id, instructorId: instructor1.id },
    { title: "Communication et Influence", slug: "communication-influence", description: "Maitrisez l'art de communiquer avec puissance et authenticite.", level: "ALL_LEVELS" as const, price: 129, published: true, categoryId: categories[3].id, instructorId: instructor2.id },
    { title: "Counseling Pastoral Avance", slug: "counseling-pastoral-avance", description: "Accompagnez vos fideles avec sagesse et competence biblique.", level: "ADVANCED" as const, price: 249, published: true, categoryId: categories[0].id, instructorId: instructor1.id },
    { title: "Louange et Adoration", slug: "louange-adoration", description: "Perfectionnez votre ministere de louange et de worship.", level: "ALL_LEVELS" as const, price: 119, published: true, categoryId: categories[1].id, instructorId: instructor2.id },
    { title: "Mentorat Ministeriel", slug: "mentorat-ministeriel", description: "Programme de mentorat intensif pour leaders pastoraux.", level: "ADVANCED" as const, price: 0, published: true, categoryId: categories[0].id, instructorId: instructor1.id },
    { title: "Gestion des Emotions et Resilience", slug: "gestion-emotions-resilience", description: "Developpez votre intelligence emotionnelle pour mieux servir.", level: "ALL_LEVELS" as const, price: 139, published: true, categoryId: categories[0].id, instructorId: instructor2.id },
    { title: "Leadership Feminin", slug: "leadership-feminin", description: "Formation specifique pour les femmes leaders dans le ministere.", level: "INTERMEDIATE" as const, price: 179, published: true, categoryId: categories[0].id, instructorId: instructor2.id },
    { title: "Theologie Pratique", slug: "theologie-pratique", description: "Approfondissez vos connaissances theologiques pour un ministere solide.", level: "ADVANCED" as const, price: 219, published: true, categoryId: categories[2].id, instructorId: instructor1.id },
  ];

  for (const c of courses) {
    const course = await prisma.course.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });

    await prisma.module.upsert({
      where: { id: `mod-${course.slug}-1` },
      update: {},
      create: {
        id: `mod-${course.slug}-1`,
        title: "Introduction",
        order: 1,
        courseId: course.id,
        lessons: {
          create: [
            { title: "Bienvenue", order: 1, content: "Contenu de bienvenue...", duration: 300 },
            { title: "Objectifs du cours", order: 2, content: "Les objectifs...", duration: 600 },
          ],
        },
      },
    });

    await prisma.module.upsert({
      where: { id: `mod-${course.slug}-2` },
      update: {},
      create: {
        id: `mod-${course.slug}-2`,
        title: "Module Principal",
        order: 2,
        courseId: course.id,
        lessons: {
          create: [
            { title: "Leçon 1 - Fondamentaux", order: 1, content: "Contenu fondamental...", duration: 900 },
            { title: "Leçon 2 - Approfondissement", order: 2, content: "Contenu approfondi...", duration: 1200 },
            { title: "Leçon 3 - Mise en pratique", order: 3, content: "Exercices pratiques...", duration: 800 },
          ],
        },
      },
    });
  }

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: student.id, courseId: (await prisma.course.findUnique({ where: { slug: "fondements-foi-leadership" } }))!.id } },
    update: {},
    create: {
      userId: student.id,
      courseId: (await prisma.course.findUnique({ where: { slug: "fondements-foi-leadership" } }))!.id,
      status: "ACTIVE",
      progress: 35,
    },
  });

  const modHash = await bcrypt.hash("Moderateur2026!", 12);
  await prisma.user.upsert({
    where: { email: "moderateur@lordlomboacademie.com" },
    update: {},
    create: {
      email: "moderateur@lordlomboacademie.com",
      passwordHash: modHash,
      firstName: "Grace",
      lastName: "Kabongo",
      role: "MODERATOR",
      bio: "Moderatrice de la plateforme Lord Lombo Academy.",
      emailVerified: true,
    },
  });

  const superHash = await bcrypt.hash("SuperAdmin2026!", 12);
  await prisma.user.upsert({
    where: { email: "superadmin@lordlomboacademie.com" },
    update: {},
    create: {
      email: "superadmin@lordlomboacademie.com",
      passwordHash: superHash,
      firstName: "Urbain",
      lastName: "Ahoadi",
      role: "SUPER_ADMIN",
      bio: "Super administrateur de la plateforme.",
      emailVerified: true,
    },
  });

  console.log("Seed completed: admin, student, 2 instructors, moderator, super_admin, 4 categories, courses with modules/lessons, 1 enrollment");

  const allCourses = await prisma.course.findMany();
  const paymentData = [
    { userId: student.id, courseId: allCourses[0].id, amount: 0, method: "FREE", status: "COMPLETED" },
    { userId: student.id, courseId: allCourses[1].id, amount: 49.99, method: "STRIPE", status: "COMPLETED" },
    { userId: admin.id, courseId: allCourses[2].id, amount: 79.99, method: "MOBILE_MONEY", status: "PENDING" },
    { userId: instructor1.id, courseId: allCourses[3].id, amount: 29.99, method: "STRIPE", status: "COMPLETED" },
  ];
  for (const p of paymentData) {
    await prisma.payment.create({
      data: {
        ...p,
        reference: `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        status: p.status as any,
        method: p.method as any,
      },
    });
  }

  await prisma.notification.createMany({
    data: [
      { userId: admin.id, title: "Nouvel inscrit", message: "Jean Kisula s'est inscrit a la formation Leadership Pastoral.", type: "success", link: "/admin/utilisateurs" },
      { userId: admin.id, title: "Paiement recu", message: "Paiement de $49.99 recu pour Masterclass Louange.", type: "payment", link: "/admin/transactions" },
      { userId: student.id, title: "Bienvenue !", message: "Bienvenue sur LL Academie. Decouvrez nos formations.", type: "info", link: "/formations" },
      { userId: student.id, title: "Formation deverrouillee", message: "Votre inscription a Fondements du Leadership est active.", type: "success", link: "/dashboard" },
    ],
  });

  console.log("Seed payments, notifications done.");

  await prisma.pricingPlan.deleteMany();
  await prisma.pricingPlan.createMany({
    data: [
      {
        slug: "FREE", nameFr: "Decouverte", nameEn: "Discovery",
        descFr: "Ideal pour explorer la plateforme", descEn: "Perfect to explore the platform",
        monthlyPrice: 0, annualPrice: 0, currency: "USD",
        featuresFr: JSON.stringify(["Acces a 2 cours gratuits", "Communaute de base", "Certificat de participation", "Support par email"]),
        featuresEn: JSON.stringify(["Access to 2 free courses", "Basic community", "Participation certificate", "Email support"]),
        popular: false, isFree: true, sortOrder: 0, active: true,
        ctaFr: "Commencer gratuitement", ctaEn: "Start for free",
      },
      {
        slug: "ESSENTIAL", nameFr: "Essentiel", nameEn: "Essential",
        descFr: "Pour les apprenants engages", descEn: "For committed learners",
        monthlyPrice: 29, annualPrice: 24, currency: "USD",
        featuresFr: JSON.stringify(["Acces a toutes les formations", "Modules pratiques illimites", "Certificats officiels", "Communaute premium", "Support prioritaire", "Sessions live mensuelles"]),
        featuresEn: JSON.stringify(["Access to all courses", "Unlimited practical modules", "Official certificates", "Premium community", "Priority support", "Monthly live sessions"]),
        popular: true, isFree: false, sortOrder: 1, active: true,
        ctaFr: "Choisir Essentiel", ctaEn: "Choose Essential",
      },
      {
        slug: "PREMIUM", nameFr: "Premium", nameEn: "Premium",
        descFr: "L'experience complete avec mentorat", descEn: "The complete experience with mentoring",
        monthlyPrice: 79, annualPrice: 65, currency: "USD",
        featuresFr: JSON.stringify(["Tout le plan Essentiel", "Coaching individuel (2x/mois)", "Acces aux masterclasses VIP", "Mentorat personnalise", "Groupe WhatsApp exclusif", "Priorite sessions live", "Contenu en avant-premiere"]),
        featuresEn: JSON.stringify(["Everything in Essential", "Individual coaching (2x/month)", "VIP masterclass access", "Personalized mentoring", "Exclusive WhatsApp group", "Priority live sessions", "Early access content"]),
        popular: false, isFree: false, sortOrder: 2, active: true,
        ctaFr: "Choisir Premium", ctaEn: "Choose Premium",
      },
    ],
  });
  console.log("Seed pricing plans done.");

  await prisma.masterclassRegistration.deleteMany();
  await prisma.masterclass.deleteMany();
  const now = new Date();
  const in7 = new Date(now.getTime() + 7 * 86400000);
  const in8 = new Date(now.getTime() + 8 * 86400000);
  const in21 = new Date(now.getTime() + 21 * 86400000);
  const in23 = new Date(now.getTime() + 23 * 86400000);
  const in35 = new Date(now.getTime() + 35 * 86400000);
  const in36 = new Date(now.getTime() + 36 * 86400000);

  await prisma.masterclass.createMany({
    data: [
      {
        title: "L'Art de la Louange Prophetique",
        titleEn: "The Art of Prophetic Worship",
        slug: "art-louange-prophetique",
        description: "Une immersion intensive dans la louange prophetique avec Pastor Lord Lombo. Decouvrez comment entrer dans la dimension prophetique de la louange, comprendre les temps et les saisons spirituelles, et developper votre sensibilite a la voix de Dieu a travers la musique et l'adoration.",
        descriptionEn: "An intensive immersion in prophetic worship with Pastor Lord Lombo. Discover how to enter the prophetic dimension of worship, understand spiritual times and seasons, and develop your sensitivity to God's voice through music and adoration.",
        shortDesc: "Masterclass intensive de 2 jours sur la louange prophetique",
        shortDescEn: "Intensive 2-day masterclass on prophetic worship",
        category: "worship",
        level: "intermediate",
        format: "ONLINE",
        status: "PUBLISHED",
        startDate: in7,
        endDate: in8,
        dailyStartTime: "09:00",
        dailyEndTime: "16:00",
        price: 49,
        currency: "USD",
        earlyBirdPrice: 29,
        earlyBirdEnd: new Date(now.getTime() + 5 * 86400000),
        maxSeats: 100,
        seatsLeft: 87,
        instructorId: admin.id,
        programFr: JSON.stringify([
          { day: "Jour 1", title: "Les fondements de la louange prophetique", items: ["Introduction a la dimension prophetique", "Les cles de l'onction dans la louange", "Atelier pratique: ecouter la voix de Dieu", "Session de questions-reponses"] },
          { day: "Jour 2", title: "La pratique avancee", items: ["Louange spontanee et flow prophetique", "Diriger un temps de louange prophetique", "Masterclass musicale avec Lord Lombo", "Ministration collective et priere"] },
        ]),
        programEn: JSON.stringify([
          { day: "Day 1", title: "Foundations of prophetic worship", items: ["Introduction to the prophetic dimension", "Keys to anointing in worship", "Workshop: hearing God's voice", "Q&A session"] },
          { day: "Day 2", title: "Advanced practice", items: ["Spontaneous worship and prophetic flow", "Leading prophetic worship", "Music masterclass with Lord Lombo", "Collective ministration and prayer"] },
        ]),
        whatYouLearnFr: JSON.stringify(["Entrer dans la dimension prophetique de la louange", "Developper votre sensibilite spirituelle", "Diriger des temps de louange avec onction", "Composer des chants prophetiques", "Creer une atmosphere de presence divine"]),
        whatYouLearnEn: JSON.stringify(["Enter the prophetic dimension of worship", "Develop your spiritual sensitivity", "Lead anointed worship sessions", "Compose prophetic songs", "Create an atmosphere of divine presence"]),
        prerequisites: JSON.stringify(["Etre musicien ou chanteur (debutant accepte)", "Avoir une Bible"]),
        includedFr: JSON.stringify(["Acces au replay pendant 30 jours", "Support PDF du cours", "Certificat de participation", "Acces au groupe WhatsApp exclusif", "1 session de mentorat post-masterclass"]),
        includedEn: JSON.stringify(["30-day replay access", "Course PDF materials", "Certificate of participation", "Exclusive WhatsApp group access", "1 post-masterclass mentoring session"]),
        isFeatured: true,
        certificateIncluded: true,
        replayAvailable: true,
      },
      {
        title: "Leadership Spirituel & Vision",
        titleEn: "Spiritual Leadership & Vision",
        slug: "leadership-spirituel-vision",
        description: "3 jours de formation intensive sur le leadership spirituel. Apprenez a developper une vision claire pour votre ministere, a batir une equipe solide et a naviguer les defis du leadership avec sagesse et integrite.",
        descriptionEn: "3 days of intensive training on spiritual leadership. Learn to develop a clear vision for your ministry, build a solid team, and navigate leadership challenges with wisdom and integrity.",
        shortDesc: "3 jours pour transformer votre leadership ministeriel",
        shortDescEn: "3 days to transform your ministry leadership",
        category: "leadership",
        level: "advanced",
        format: "HYBRID",
        status: "PUBLISHED",
        startDate: in21,
        endDate: in23,
        dailyStartTime: "08:30",
        dailyEndTime: "17:30",
        location: "Kinshasa, RDC + en ligne",
        price: 99,
        currency: "USD",
        earlyBirdPrice: 69,
        earlyBirdEnd: new Date(now.getTime() + 14 * 86400000),
        maxSeats: 50,
        seatsLeft: 42,
        instructorId: admin.id,
        programFr: JSON.stringify([
          { day: "Jour 1", title: "Fondements du leadership", items: ["L'appel et la vocation", "Developper une vision divine", "Les piliers du caractere du leader"] },
          { day: "Jour 2", title: "Batir et diriger", items: ["Former une equipe performante", "La communication du leader", "Gerer les conflits avec grace"] },
          { day: "Jour 3", title: "Aller plus loin", items: ["L'innovation dans le ministere", "Perenniser son impact", "Plan d'action personnalise"] },
        ]),
        programEn: JSON.stringify([
          { day: "Day 1", title: "Leadership foundations", items: ["The call and vocation", "Developing divine vision", "Pillars of leader character"] },
          { day: "Day 2", title: "Build and lead", items: ["Building a high-performing team", "Leader's communication", "Managing conflicts with grace"] },
          { day: "Day 3", title: "Going further", items: ["Innovation in ministry", "Sustaining your impact", "Personalized action plan"] },
        ]),
        whatYouLearnFr: JSON.stringify(["Clarifier votre vision ministerielle", "Batir une equipe engagee", "Communiquer avec impact", "Gerer les transitions", "Creer un plan strategique"]),
        whatYouLearnEn: JSON.stringify(["Clarify your ministry vision", "Build an engaged team", "Communicate with impact", "Manage transitions", "Create a strategic plan"]),
        prerequisites: JSON.stringify(["Etre en position de leadership ou aspirant leader"]),
        includedFr: JSON.stringify(["Kit du leader (classeur + fiches)", "Acces replay 60 jours", "Certificat Leadership LLM", "Communaute alumni", "2 sessions mentorat"]),
        includedEn: JSON.stringify(["Leader kit (binder + cards)", "60-day replay access", "LLM Leadership Certificate", "Alumni community", "2 mentoring sessions"]),
        isFeatured: true,
        certificateIncluded: true,
        replayAvailable: true,
      },
      {
        title: "Ecriture Creative & Publication",
        titleEn: "Creative Writing & Publishing",
        slug: "ecriture-creative-publication",
        description: "Masterclass d'une journee intensive avec l'auteur Lord Lombo. De l'inspiration a la publication, decouvrez le processus complet pour ecrire et publier votre premier livre.",
        descriptionEn: "One-day intensive masterclass with author Lord Lombo. From inspiration to publication, discover the complete process to write and publish your first book.",
        shortDesc: "De l'inspiration a la publication en 1 jour",
        shortDescEn: "From inspiration to publication in 1 day",
        category: "writing",
        level: "beginner",
        format: "ONLINE",
        status: "PUBLISHED",
        startDate: in35,
        endDate: in36,
        dailyStartTime: "10:00",
        dailyEndTime: "18:00",
        price: 35,
        currency: "USD",
        maxSeats: 200,
        seatsLeft: 178,
        instructorId: admin.id,
        programFr: JSON.stringify([
          { day: "Jour 1", title: "De l'idee au manuscrit", items: ["Trouver votre voix d'auteur", "Structurer votre livre", "Techniques d'ecriture avancees", "Le processus de publication", "Seance d'ecriture guidee"] },
        ]),
        programEn: JSON.stringify([
          { day: "Day 1", title: "From idea to manuscript", items: ["Finding your author voice", "Structuring your book", "Advanced writing techniques", "The publishing process", "Guided writing session"] },
        ]),
        whatYouLearnFr: JSON.stringify(["Structurer un livre de A a Z", "Techniques d'ecriture professionnelle", "Le processus de publication", "Marketing de votre livre"]),
        whatYouLearnEn: JSON.stringify(["Structure a book from A to Z", "Professional writing techniques", "The publishing process", "Marketing your book"]),
        prerequisites: JSON.stringify([]),
        includedFr: JSON.stringify(["Guide de l'auteur (PDF)", "Template de plan de livre", "Replay 30 jours", "Certificat"]),
        includedEn: JSON.stringify(["Author's guide (PDF)", "Book plan template", "30-day replay", "Certificate"]),
        isFeatured: false,
        certificateIncluded: true,
        replayAvailable: true,
      },
    ],
  });
  console.log("Seed masterclasses done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
