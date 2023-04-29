import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { LoggerService } from "./shared/logger.service";
import winston from "winston";
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from "nest-winston";
import moment from "moment";
import { HttpModule } from "@nestjs/axios";
import { CacheModule } from "@nestjs/cache-manager";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { HttpCacheInterceptor } from "./shared/http.interceptor";
import * as redisStore from "cache-manager-redis-store";
@Module({
  imports: [
    CacheModule.register({
      ttl: 60, // seconds
      max: 10,
      store: redisStore,
      host: "localhost",
      port: 6379,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        transports: [
          new winston.transports.File({
            filename: `${process.cwd()}/logs/log-${moment().format(
              "YYYY-MM-DD"
            )}.log`,
          }),
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              nestWinstonModuleUtilities.format.nestLike()
            ),
          }),
        ],
      }),
      inject: [ConfigService],
    }),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
})
export class AppModule {}
