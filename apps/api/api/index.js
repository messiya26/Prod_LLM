const { NestFactory } = require("@nestjs/core");
const { AppModule } = require("../dist/app.module");
const { ValidationPipe } = require("@nestjs/common");

let app;

module.exports = async (req, res) => {
  if (!app) {
    app = await NestFactory.create(AppModule, { logger: false });
    app.enableCors({ origin: true, credentials: true });
    app.setGlobalPrefix("api/v1");
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  }
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
};
