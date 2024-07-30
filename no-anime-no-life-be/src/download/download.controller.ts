import { HttpService } from "@nestjs/axios";
import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';

import { AnimeCategoryInfo } from "src/type";
import OSS from 'ali-oss'
import { DownloadService } from "./download.service";
import { extname, normalize, join } from 'path'
import { imagePath } from "../../src/common";
import { clearImageCache } from "../../src/utils";

@Controller('share')
export class DownloadController {
  private client
  constructor(
    private readonly downloadService: DownloadService,
  ) {
    const client = new OSS({
      region: 'oss-cn-shenzhen', // 示例：'oss-cn-hangzhou'，填写Bucket所在地域。
      accessKeyId: process.env.ALC_ACCESS_KEY, // 确保已设置环境变量ALC_ACCESS_KEY。
      accessKeySecret: process.env.ALC_SECRET_KEY, // 确保已设置环境变量ALC_SECRET_KEY。
      bucket: 'no-anime-no-life', // 示例：'my-bucket-name'，填写存储空间名称。
      secure: true,
    });
    this.client = client
  }

  @Post()
  async downloadImage(@Body() list: AnimeCategoryInfo[]) {
    const localImgList = await this.downloadService.download(list)
    const promiseArr: Promise<any>[] = []
    const cachePath = []

    localImgList.forEach(async ({ name }) => {

      const savedOSSPath = join(
        'cover',
        `${new Date().getTime()}-${name}`,
      )
      const localPath = `${imagePath}/${name}`
      cachePath.push(localPath)
      const res = this.client.put(savedOSSPath, localPath)
      promiseArr.push(res)

    })

    const res: { url: string }[] = await Promise.all(promiseArr)
    const ossUrlList = res.map(item => item.url)
    clearImageCache(cachePath)

    const newList: AnimeCategoryInfo[] = list.map(item => {
      return {
        ...item,
        list: item.list.map(item => {
          return {
            aid: item.aid,
            id: item.id,
            name_cn: item.name_cn,
            ossUrl: ossUrlList.find(url => url.includes(item.aid))
          }
        })
      }
    })
    return newList


  }
}