import { PrismaClient } from ".prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import * as bcrypt from "bcryptjs";
import * as path from "path";

const dbUrl = "file:" + path.join(__dirname, "dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminHash = await bcrypt.hash("Admin2026!", 12);
  const studentHash = await bcrypt.hash("Student2026!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@lordlomboacademie.com" },
    update: {},
    create: {
      email: "admin@lordlomboacademie.com",
      passwordHash: adminHash,
      firstName: "Admin",
      lastName: "LLA",
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
    {
      title: "Les Fondements du Leadership Pastoral",
      slug: "fondements-leadership-pastoral",
      description: "Un parcours complet pour comprendre et exercer le leadership pastoral avec excellence. Apprenez les principes bibliques et pratiques du leadership.",
      level: "BEGINNER" as const,
      price: 0,
      published: true,
      categoryId: categories[0].id,
      instructorId: instructor1.id,
    },
    {
      title: "Masterclass Louange & Worship",
      slug: "masterclass-louange-worship",
      description: "Perfectionnez votre ministère de louange. Techniques vocales, direction de chorale, et sensibilité spirituelle dans le worship.",
      level: "INTERMEDIATE" as const,
      price: 49.99,
      published: true,
      categoryId: categories[1].id,
      instructorId: instructor2.id,
    },
    {
      title: "Étude Approfondie des Épîtres",
      slug: "etude-approfondie-epitres",
      description: "Plongez dans l'étude des épîtres pauliniennes. Contexte historique, exégèse et application contemporaine.",
      level: "ADVANCED" as const,
      price: 79.99,
      published: true,
      categoryId: categories[2].id,
      instructorId: instructor1.id,
    },
    {
      title: "Communication Efficace pour Ministères",
      slug: "communication-efficace-ministeres",
      description: "Maîtrisez l'art de communiquer votre vision. Réseaux sociaux, branding, et engagement communautaire.",
      level: "ALL_LEVELS" as const,
      price: 29.99,
      published: true,
      categoryId: categories[3].id,
      instructorId: instructor2.id,
    },
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
    where: { userId_courseId: { userId: student.id, courseId: (await prisma.course.findUnique({ where: { slug: "fondements-leadership-pastoral" } }))!.id } },
    update: {},
    create: {
      userId: student.id,
      courseId: (await prisma.course.findUnique({ where: { slug: "fondements-leadership-pastoral" } }))!.id,
      status: "ACTIVE",
      progress: 35,
    },
  });

  console.log("Seed completed: admin, student, 2 instructors, 4 categories, 4 courses with modules/lessons, 1 enrollment");

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
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
