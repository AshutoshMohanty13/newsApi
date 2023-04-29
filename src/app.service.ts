import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {
    // this.getData(10);
  }
  async getData(numberOfRecords: number, query?: string) {
    try {
      const apiUrl = `https://gnews.io/api/v4/search?q=${query}&lang=en&country=us&max=${numberOfRecords}&apikey=${this.configService.get(
        "GNEWS_API_KEY"
      )}`;

      const response = await axios.get(apiUrl);
      response.data.count = response.data.articles.length;

      return response.data;
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }
}
