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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentGatewayService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const DEFAULT_GATEWAYS = [
    { code: "STRIPE", name: "Carte bancaire (Stripe)", icon: "credit-card", config: { publishableKey: "", secretKey: "", webhookSecret: "" } },
    { code: "PAYPAL", name: "PayPal", icon: "paypal", config: { clientId: "", clientSecret: "", mode: "sandbox" } },
    { code: "MPESA", name: "M-Pesa", icon: "phone", config: { consumerKey: "", consumerSecret: "", shortCode: "", passKey: "", callbackUrl: "" } },
    { code: "MOBILE_MONEY", name: "Mobile Money (MTN/Orange/Airtel)", icon: "smartphone", config: { provider: "MTN", apiKey: "", apiUser: "", subscriptionKey: "", callbackUrl: "" } },
    { code: "ILLICOCASH", name: "Illicocash", icon: "wallet", config: { merchantId: "", apiKey: "", callbackUrl: "" } },
    { code: "CASH_APP", name: "Cash App", icon: "dollar-sign", config: { cashtag: "", apiKey: "" } },
    { code: "BANK_TRANSFER", name: "Virement bancaire", icon: "building", config: { bankName: "", accountName: "", accountNumber: "", swiftCode: "", iban: "" } },
];
let PaymentGatewayService = class PaymentGatewayService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        let gateways = await this.prisma.paymentGateway.findMany({ orderBy: { createdAt: "asc" } });
        if (gateways.length === 0) {
            await this.prisma.paymentGateway.createMany({
                data: DEFAULT_GATEWAYS.map((g) => ({
                    code: g.code,
                    name: g.name,
                    icon: g.icon,
                    enabled: false,
                    sandboxMode: true,
                    config: g.config,
                })),
            });
            gateways = await this.prisma.paymentGateway.findMany({ orderBy: { createdAt: "asc" } });
        }
        return gateways;
    }
    async findEnabled() {
        return this.prisma.paymentGateway.findMany({ where: { enabled: true }, orderBy: { createdAt: "asc" } });
    }
    async update(id, data) {
        return this.prisma.paymentGateway.update({ where: { id }, data });
    }
    async getPublicGateways() {
        const gateways = await this.findEnabled();
        return gateways.map((g) => ({
            code: g.code,
            name: g.name,
            icon: g.icon,
            enabled: g.enabled,
        }));
    }
    async getConfigFields(code) {
        const fieldMap = {
            STRIPE: [
                { field: "publishableKey", label: "Cle publique (pk_...)", type: "text", required: true },
                { field: "secretKey", label: "Cle secrete (sk_...)", type: "password", required: true },
                { field: "webhookSecret", label: "Secret Webhook (whsec_...)", type: "password", required: false },
            ],
            PAYPAL: [
                { field: "clientId", label: "Client ID", type: "text", required: true },
                { field: "clientSecret", label: "Client Secret", type: "password", required: true },
                { field: "mode", label: "Mode (sandbox/live)", type: "text", required: true },
            ],
            MPESA: [
                { field: "consumerKey", label: "Consumer Key", type: "text", required: true },
                { field: "consumerSecret", label: "Consumer Secret", type: "password", required: true },
                { field: "shortCode", label: "Short Code (Paybill)", type: "text", required: true },
                { field: "passKey", label: "Pass Key", type: "password", required: true },
                { field: "callbackUrl", label: "URL de callback", type: "text", required: true },
            ],
            MOBILE_MONEY: [
                { field: "provider", label: "Operateur (MTN/Orange/Airtel)", type: "text", required: true },
                { field: "apiKey", label: "API Key", type: "password", required: true },
                { field: "apiUser", label: "API User", type: "text", required: true },
                { field: "subscriptionKey", label: "Subscription Key", type: "password", required: true },
                { field: "callbackUrl", label: "URL de callback", type: "text", required: true },
            ],
            ILLICOCASH: [
                { field: "merchantId", label: "Merchant ID", type: "text", required: true },
                { field: "apiKey", label: "API Key", type: "password", required: true },
                { field: "callbackUrl", label: "URL de callback", type: "text", required: true },
            ],
            CASH_APP: [
                { field: "cashtag", label: "Cashtag ($votrecompte)", type: "text", required: true },
                { field: "apiKey", label: "API Key (optionnel)", type: "password", required: false },
            ],
            BANK_TRANSFER: [
                { field: "bankName", label: "Nom de la banque", type: "text", required: true },
                { field: "accountName", label: "Titulaire du compte", type: "text", required: true },
                { field: "accountNumber", label: "Numero de compte", type: "text", required: true },
                { field: "swiftCode", label: "Code SWIFT/BIC", type: "text", required: false },
                { field: "iban", label: "IBAN", type: "text", required: false },
            ],
        };
        return fieldMap[code] || [];
    }
};
exports.PaymentGatewayService = PaymentGatewayService;
exports.PaymentGatewayService = PaymentGatewayService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentGatewayService);
//# sourceMappingURL=payment-gateway.service.js.map