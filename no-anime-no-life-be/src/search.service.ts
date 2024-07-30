import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Observable, catchError, firstValueFrom } from "rxjs";

interface SearchResponse {
  results: Number,
  list: []
}

@Injectable()
export class SearchService {
  constructor(private readonly httpService: HttpService) { }

  async findAll(keyword: string): Promise<SearchResponse> {
    const { data } = await firstValueFrom(
      this.httpService.get<SearchResponse>(`https://api.bgm.tv/search/subject/${keyword}?type=2&max_results=25&start=1`, {
        headers: {
          'User-Agent': 'iacg-world/no-anime-no-life',
          'Content-Type': 'application/json'
        }
      }).pipe(
        catchError((error: AxiosError) => {
          throw 'An error happened!';
        }),
      ),
    )
    return data
  }
}