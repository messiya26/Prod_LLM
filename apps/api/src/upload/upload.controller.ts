import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, BadRequestException, Get, Param, Res } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { randomBytes } from "crypto";
import { Response } from "express";
import { existsSync } from "fs";

const UPLOAD_DIR = join(process.cwd(), "uploads");

const storage = diskStorage({
  destination: (_req: any, file: Express.Multer.File, cb: any) => {
    const mime = file.mimetype;
    let sub = "images";
    if (mime.startsWith("video/")) sub = "videos";
    else if (mime === "application/pdf" || mime.startsWith("audio/") || mime.includes("document") || mime.includes("spreadsheet")) sub = "resources";
    cb(null, join(UPLOAD_DIR, sub));
  },
  filename: (_req: any, file: Express.Multer.File, cb: any) => {
    const unique = randomBytes(12).toString("hex");
    cb(null, `${unique}${extname(file.originalname)}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  const allowed = /\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|mp3|wav|ogg|pdf|doc|docx|xls|xlsx|pptx|txt)$/i;
  if (!allowed.test(extname(file.originalname))) {
    return cb(new BadRequestException("Type de fichier non autorise"), false);
  }
  cb(null, true);
};

@Controller("upload")
export class UploadController {
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file", { storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } }))
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("Aucun fichier envoye");
    const mime = file.mimetype;
    let sub = "images";
    if (mime.startsWith("video/")) sub = "videos";
    else if (mime === "application/pdf" || mime.startsWith("audio/") || mime.includes("document") || mime.includes("spreadsheet")) sub = "resources";
    return {
      url: `/uploads/${sub}/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  @Get(":folder/:filename")
  serve(@Param("folder") folder: string, @Param("filename") filename: string, @Res() res: Response) {
    const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "");
    const path = join(UPLOAD_DIR, folder, safe);
    if (!existsSync(path)) return res.status(404).json({ error: "Fichier introuvable" });
    return res.sendFile(path);
  }
}
