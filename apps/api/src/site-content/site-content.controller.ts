import { Controller, Get, Put, Post, Body, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/guards/roles.decorator";
import { SiteContentService } from "./site-content.service";

const DEFAULTS: { key: string; value: string; type: string }[] = [
  { key: "hero_title", value: "Lord Lombo Academie", type: "text" },
  { key: "hero_subtitle", value: "Transformez votre vie par la connaissance, la foi et le leadership", type: "text" },
  { key: "hero_cta", value: "Decouvrir l'Academie", type: "text" },
  { key: "hero_image", value: "/images/hero-bg.jpg", type: "image" },
  { key: "about_title", value: "A propos de Lord Lombo Ministries", type: "text" },
  { key: "about_description", value: "Lord Lombo Ministries est un ministere dedie a la transformation des vies par la musique, l'enseignement et le service. Fonde par le Pasteur Lord Lombo, le ministere touche des milliers de personnes a travers le monde.", type: "textarea" },
  { key: "about_vision", value: "Former une generation de leaders transformes par la foi, capables d'impacter positivement leur communaute et le monde.", type: "textarea" },
  { key: "about_mission", value: "Offrir des formations de qualite accessibles a tous, en combinant excellence academique, valeurs spirituelles et accompagnement personnalise.", type: "textarea" },
  { key: "about_image", value: "/images/lord-lombo.jpg", type: "image" },
  { key: "stat_students", value: "2500+", type: "text" },
  { key: "stat_students_label", value: "Etudiants formes", type: "text" },
  { key: "stat_courses", value: "45+", type: "text" },
  { key: "stat_courses_label", value: "Formations disponibles", type: "text" },
  { key: "stat_countries", value: "30+", type: "text" },
  { key: "stat_countries_label", value: "Pays representes", type: "text" },
  { key: "stat_satisfaction", value: "98%", type: "text" },
  { key: "stat_satisfaction_label", value: "Taux de satisfaction", type: "text" },
  { key: "testimonials", value: JSON.stringify([
    { name: "Marie K.", role: "Etudiante en Leadership", text: "Cette formation a completement change ma vision du leadership. Le Pasteur Lord Lombo transmet avec une onction unique.", avatar: "" },
    { name: "Jean-Paul M.", role: "Pasteur", text: "Les enseignements sont profonds et pratiques. J'ai pu appliquer immediatement ce que j'ai appris dans mon ministere.", avatar: "" },
    { name: "Grace N.", role: "Etudiante en Worship", text: "L'Academie m'a permis de developper mes dons musicaux tout en approfondissant ma relation avec Dieu.", avatar: "" },
  ]), type: "json" },
  { key: "plans", value: JSON.stringify([
    { name: "Decouverte", price: 0, currency: "USD", period: "gratuit", features: ["Acces aux cours gratuits", "Communaute en ligne", "Ressources de base"], recommended: false },
    { name: "Essentiel", price: 29, currency: "USD", period: "mois", features: ["Tous les cours standards", "Certificats de completion", "Support par email", "Acces aux replays live"], recommended: true },
    { name: "Premium", price: 79, currency: "USD", period: "mois", features: ["Tous les cours + masterclasses", "Mentorat personnalise", "Acces prioritaire aux lives", "Certificats premium", "Support prioritaire 24/7"], recommended: false },
  ]), type: "json" },
  { key: "footer_contact_email", value: "contact@lordlomboacademie.com", type: "text" },
  { key: "footer_contact_phone", value: "+243 XXX XXX XXX", type: "text" },
  { key: "footer_social_facebook", value: "https://facebook.com/lordlombo", type: "text" },
  { key: "footer_social_instagram", value: "https://instagram.com/lordlombo", type: "text" },
  { key: "footer_social_youtube", value: "https://youtube.com/lordlombo", type: "text" },
  { key: "footer_social_twitter", value: "", type: "text" },
];

@Controller("site-content")
export class SiteContentController {
  constructor(private readonly siteContentService: SiteContentService) {}

  @Get()
  getAll() { return this.siteContentService.getAll(); }

  @Get(":key")
  get(@Param("key") key: string) { return this.siteContentService.get(key); }

  @Put(":key")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "SUPER_ADMIN")
  upsert(@Param("key") key: string, @Body() body: { value: string; type?: string }) {
    return this.siteContentService.upsert(key, body.value, body.type);
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "SUPER_ADMIN")
  bulkUpsert(@Body() body: { items: { key: string; value: string; type?: string }[] }) {
    return this.siteContentService.bulkUpsert(body.items);
  }

  @Post("seed")
  async seed() {
    const existing = await this.siteContentService.getAll();
    const existingKeys = new Set(existing.map((e: any) => e.key));
    const toCreate = DEFAULTS.filter((d) => !existingKeys.has(d.key));
    if (toCreate.length > 0) {
      await this.siteContentService.bulkUpsert(toCreate);
    }
    return { seeded: toCreate.length, total: DEFAULTS.length };
  }
}
