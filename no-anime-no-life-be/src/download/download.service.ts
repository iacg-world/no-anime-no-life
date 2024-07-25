import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosError, AxiosResponse } from "axios";
import { Observable, catchError, firstValueFrom } from "rxjs";
import { AnimeCategoryInfo } from "src/type";
import fs from 'fs'
import { imagePath } from "../../src/common";
import { nanoid } from 'nanoid'

interface ImageInfo {
  aid: string,
  name: string
  url: string
}
@Injectable()
export class DownloadService {
  constructor(private readonly httpService: HttpService) { }


  async download(list: AnimeCategoryInfo[]): Promise<string[]> {
    let imgList: ImageInfo[] = []
    
    list.forEach(item => {
      
      imgList = imgList.concat(item.list.map(item => {
        return {
          url: item.images?.large || item.images?.medium,
          aid: item.aid,
          name: (item.aid || 'none') + '-' + nanoid()
        }
      }))
    })


    return new Promise((resolve, reject) => {
      const res = []
      imgList.forEach(async (item) => {
        const response = await this.httpService.axiosRef({
          url: item.url,
          method: 'GET',
          responseType: 'stream',
        });

        const fileName = item.name + '.jpg'
        fs.writeFileSync(`${imagePath}/${fileName}`, 'test');
        const writer = fs.createWriteStream(`${imagePath}/${fileName}`);

        response.data.pipe(writer);

        writer.on('finish', () => {
          res.push(fileName)
          if(res.length === imgList.length) {
            resolve(res)
          }
        });
        writer.on('error', () => {
          reject('download fail')
          throw 'download fail'
        });
      })
    })
  }
}