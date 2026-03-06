"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteContentController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/guards/roles.decorator");
const site_content_service_1 = require("./site-content.service");
const DEFAULTS = [
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
let SiteContentController = class SiteContentController {
    constructor(siteContentService) {
        this.siteContentService = siteContentService;
    }
    getAll() { return this.siteContentService.getAll(); }
    get(key) { return this.siteContentService.get(key); }
    upsert(key, body) {
        return this.siteContentService.upsert(key, body.value, body.type);
    }
    bulkUpsert(body) {
        return this.siteContentService.bulkUpsert(body.items);
    }
    async seed() {
        const existing = await this.siteContentService.getAll();
        const existingKeys = new Set(existing.map((e) => e.key));
        const toCreate = DEFAULTS.filter((d) => !existingKeys.has(d.key));
        if (toCreate.length > 0) {
            await this.siteContentService.bulkUpsert(toCreate);
        }
        return { seeded: toCreate.length, total: DEFAULTS.length };
    }
};
exports.SiteContentController = SiteContentController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SiteContentController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(":key"),
    __param(0, (0, common_1.Param)("key")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SiteContentController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(":key"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "SUPER_ADMIN"),
    __param(0, (0, common_1.Param)("key")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SiteContentController.prototype, "upsert", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "SUPER_ADMIN"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SiteContentController.prototype, "bulkUpsert", null);
__decorate([
    (0, common_1.Post)("seed"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SiteContentController.prototype, "seed", null);
exports.SiteContentController = SiteContentController = __decorate([
    (0, common_1.Controller)("site-content"),
    __metadata("design:paramtypes", [site_content_service_1.SiteContentService])
], SiteContentController);
//# sourceMappingURL=site-content.controller.js.map