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
      accessKeyId: process.env.OSS_ACCESS_KEY_ID, // 确保已设置环境变量OSS_ACCESS_KEY_ID。
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET, // 确保已设置环境变量OSS_ACCESS_KEY_SECRET。
      bucket: 'no-anime-no-life', // 示例：'my-bucket-name'，填写存储空间名称。
    });
    this.client = client
  }

  @Post()
  async downloadImage(@Body() list: AnimeCategoryInfo[]) {
    const nameList = await this.downloadService.download(list)
    const promiseArr: Promise<Function>[] = []
    const cachePath = []

    nameList.forEach(async (name) => {
      
      const savedOSSPath = join(
        'cover',
         `${name}-${new Date().getTime()}`,
      )
      const localPath = `${imagePath}/${name}`
      cachePath.push(localPath)
      const res = this.client.put(savedOSSPath, localPath)
      promiseArr.push(res)

    })
    
    const res = await Promise.all(promiseArr)
    clearImageCache(cachePath)

    const newList = res
    return newList
    

  }
}