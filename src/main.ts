import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { LoggerService } from "./shared/logger.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);

  const port = configService.get<number>("PORT");

  await app.listen(port);
  logger.info(`Server running on http://localhost:${port}`);
}
bootstrap();
