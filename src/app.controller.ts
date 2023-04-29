import { Controller, Get, Param, Query, UseInterceptors } from "@nestjs/common";
import { AppService } from "./app.service";
import { HttpCacheInterceptor } from "./shared/http.interceptor";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseInterceptors(HttpCacheInterceptor)
  @Get("news/:max")
  getData(@Param("max") maxRecord: number, @Query("query") query: string) {
    return this.appService.getData(maxRecord, query);
  }
}
