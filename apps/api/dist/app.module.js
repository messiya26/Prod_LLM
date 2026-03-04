"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const prisma_1 = require("./prisma");
const mail_module_1 = require("./mail/mail.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const courses_module_1 = require("./courses/courses.module");
const enrollments_module_1 = require("./enrollments/enrollments.module");
const contact_module_1 = require("./contact/contact.module");
const health_module_1 = require("./health/health.module");
const payments_module_1 = require("./payments/payments.module");
const bookings_module_1 = require("./bookings/bookings.module");
const notifications_module_1 = require("./notifications/notifications.module");
const certificates_module_1 = require("./certificates/certificates.module");
const resources_module_1 = require("./resources/resources.module");
const live_module_1 = require("./live/live.module");
const invitations_module_1 = require("./invitations/invitations.module");
const upload_module_1 = require("./upload/upload.module");
const blog_module_1 = require("./blog/blog.module");
const events_module_1 = require("./events/events.module");
const site_content_module_1 = require("./site-content/site-content.module");
const modules_module_1 = require("./modules/modules.module");
const subscriptions_module_1 = require("./subscriptions/subscriptions.module");
const masterclasses_module_1 = require("./masterclasses/masterclasses.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
            prisma_1.PrismaModule,
            mail_module_1.MailModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            courses_module_1.CoursesModule,
            enrollments_module_1.EnrollmentsModule,
            contact_module_1.ContactModule,
            health_module_1.HealthModule,
            payments_module_1.PaymentsModule,
            bookings_module_1.BookingsModule,
            notifications_module_1.NotificationsModule,
            certificates_module_1.CertificatesModule,
            resources_module_1.ResourcesModule,
            live_module_1.LiveModule,
            invitations_module_1.InvitationsModule,
            upload_module_1.UploadModule,
            blog_module_1.BlogModule,
            events_module_1.EventsModule,
            site_content_module_1.SiteContentModule,
            modules_module_1.CourseModulesModule,
            subscriptions_module_1.SubscriptionsModule,
            masterclasses_module_1.MasterclassesModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map