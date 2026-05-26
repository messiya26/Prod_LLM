import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { join } from "path";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix("api/v1");

  // ===== KILL-SWITCH API =====
  // Si API_OPEN != "yes", l'API repond 503 sur toutes les routes.
  if (process.env.API_OPEN !== "yes") {
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.use((_req: any, res: any) => {
      res.status(503)
        .set("Retry-After", "86400")
        .set("Cache-Control", "no-store")
        .json({ statusCode: 503, message: "Service Unavailable" });
    });
    const port = process.env.PORT || 3002;
    await app.listen(port);
    console.log(`[API CLOSED] Listening on ${port} — toutes requetes -> 503`);
    return;
  }

  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));

  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",")
    : ["http://localhost:3000", "http://localhost:3001", "http://localhost:3005", "https://lordlomboministries.com", "https://www.lordlomboministries.com", "https://lord-lombo-academie.vercel.app"];
  app.enableCors({ origin: allowedOrigins, credentials: true });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    disableErrorMessages: process.env.NODE_ENV === "production",
  }));

  app.useStaticAssets(join(process.cwd(), "uploads"), { prefix: "/uploads/" });

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}/api/v1`);
}
bootstrap();
