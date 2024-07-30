import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosError, AxiosResponse } from "axios";
import { Observable, catchError, firstValueFrom } from "rxjs";
import { AnimeCategoryInfo, LocalImgInfo } from "src/type";
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


  async download(list: AnimeCategoryInfo[]): Promise<LocalImgInfo[]> {
    let imgList: ImageInfo[] = []
    if(!fs.existsSync(imagePath)) {
      fs.mkdirSync(imagePath);
    }
    list.forEach(item => {

      imgList = imgList.concat(item.list.map(item => {
        return {
          url: item.images?.medium || item.images?.large,
          aid: item.aid,
          name: item.aid + '-' + nanoid()
        }
      }))
    })

    return new Promise((resolve, reject) => {
      const res: LocalImgInfo[] = []
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
          res.push({
            aid: item.aid,
            name: fileName
          })
          if (res.length === imgList.length) {
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