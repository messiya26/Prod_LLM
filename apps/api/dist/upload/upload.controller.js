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
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const multer_1 = require("multer");
const path_1 = require("path");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const UPLOAD_DIR = (0, path_1.join)(process.cwd(), "uploads");
const storage = (0, multer_1.diskStorage)({
    destination: (_req, file, cb) => {
        const mime = file.mimetype;
        let sub = "images";
        if (mime.startsWith("video/"))
            sub = "videos";
        else if (mime === "application/pdf" || mime.startsWith("audio/") || mime.includes("document") || mime.includes("spreadsheet"))
            sub = "resources";
        cb(null, (0, path_1.join)(UPLOAD_DIR, sub));
    },
    filename: (_req, file, cb) => {
        const unique = (0, crypto_1.randomBytes)(12).toString("hex");
        cb(null, `${unique}${(0, path_1.extname)(file.originalname)}`);
    },
});
const fileFilter = (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|mp3|wav|ogg|pdf|doc|docx|xls|xlsx|pptx|txt)$/i;
    if (!allowed.test((0, path_1.extname)(file.originalname))) {
        return cb(new common_1.BadRequestException("Type de fichier non autorise"), false);
    }
    cb(null, true);
};
let UploadController = class UploadController {
    upload(file) {
        if (!file)
            throw new common_1.BadRequestException("Aucun fichier envoye");
        const mime = file.mimetype;
        let sub = "images";
        if (mime.startsWith("video/"))
            sub = "videos";
        else if (mime === "application/pdf" || mime.startsWith("audio/") || mime.includes("document") || mime.includes("spreadsheet"))
            sub = "resources";
        return {
            url: `/uploads/${sub}/${file.filename}`,
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
        };
    }
    serve(folder, filename, res) {
        const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "");
        const path = (0, path_1.join)(UPLOAD_DIR, folder, safe);
        if (!(0, fs_1.existsSync)(path))
            return res.status(404).json({ error: "Fichier introuvable" });
        return res.sendFile(path);
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", { storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)(":folder/:filename"),
    __param(0, (0, common_1.Param)("folder")),
    __param(1, (0, common_1.Param)("filename")),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "serve", null);
exports.UploadController = UploadController = __decorate([
    (0, common_1.Controller)("upload")
], UploadController);
//# sourceMappingURL=upload.controller.js.map