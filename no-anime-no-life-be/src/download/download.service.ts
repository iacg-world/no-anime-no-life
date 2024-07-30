import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosError, AxiosResponse } from "axios";
import { Observable, catchError, firstValueFrom } from "rxjs";
import { AnimeCategoryInfo, LocalImgInfo, OSSImgInfo } from "src/type";
import fs from 'fs'
import { imagePath } from "../../src/common";
import { nanoid } from 'nanoid'
import OSS from 'ali-oss'

interface ImageInfo {
  aid: string,
  name: string
  url: string
  id: number
}
@Injectable()
export class DownloadService {
  private client
  constructor(private readonly httpService: HttpService) { 

    const client = new OSS({
      region: 'oss-cn-shenzhen', // 示例：'oss-cn-hangzhou'，填写Bucket所在地域。
      accessKeyId: process.env.ALC_ACCESS_KEY, // 确保已设置环境变量ALC_ACCESS_KEY。
      accessKeySecret: process.env.ALC_SECRET_KEY, // 确保已设置环境变量ALC_SECRET_KEY。
      bucket: 'no-anime-no-life', // 示例：'my-bucket-name'，填写存储空间名称。
      secure: true,
    });
    this.client = client
  }


  async download(list: AnimeCategoryInfo[]): Promise<LocalImgInfo[]> {
    const ossList: OSSImgInfo[] = (await this.client.list()).objects;
    
    let imgList: ImageInfo[] = []
    
    if(!fs.existsSync(imagePath)) {
      fs.mkdirSync(imagePath);
    }
    list.forEach(item => {

      imgList = imgList.concat(item.list.map(item => {
        return {
          url: item.images?.medium || item.images?.large,
          aid: item.aid,
          id: item.id,
          name: item.id + '-' + nanoid()
        }
      }))
    })

    return new Promise((resolve, reject) => {
      const res: LocalImgInfo[] = []
      imgList.forEach(async (item) => {
        const existTarget = ossList.find(ossItem => ossItem.name.includes(String(item.id)))
        
        if (existTarget) {
          res.push({
            aid: item.aid,
            name: existTarget.name,
            id: item.id,
            ossUrl: existTarget.url,
          })
          if (res.length === imgList.length) {
            resolve(res)
          }
          return
        }
        const response = await this.httpService.axiosRef({
          url: item.url,
          method: 'GET',
          responseType: 'stream',
        });

        const fileName = item.name + '.jpg'

        fs.openSync(`${imagePath}/${fileName}`, 'w')
        const writer = fs.createWriteStream(`${imagePath}/${fileName}`);

        response.data.pipe(writer);

        writer.on('finish', () => {
          res.push({
            aid: item.aid,
            name: fileName,
            id: item.id,
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