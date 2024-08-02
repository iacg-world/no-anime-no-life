import { HttpService } from "@nestjs/axios";
import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';

import { AnimeCategoryInfo } from "src/type";
import OSS from 'ali-oss'
import { DownloadService } from "./download.service";
import { extname, normalize, join } from 'path'
import { imagePath } from "../../src/common";
import { clearImageCache } from "../../src/utils";
import { OssService } from "../OssService";

const asyncUrl = (url) => {
  return new Promise((resolve) => {
    resolve({
      url,
    })
  })
}

@Controller('share')
export class DownloadController {
  constructor(
    private readonly downloadService: DownloadService,
    private readonly oss: OssService
  ) {

  }

  @Post()
  async downloadImage(@Body() list: AnimeCategoryInfo[]) {
    const localImgList = await this.downloadService.download(list)
    const promiseArr: Promise<any>[] = []
    const cachePath = []
    

    localImgList.forEach(async ({ name, ossUrl }) => {

      // const savedOSSPath = `${new Date().getTime()}-${name}`
      const localPath = `${imagePath}/${name}`
      cachePath.push(localPath)
      const res = ossUrl ? asyncUrl(ossUrl) : this.oss.client.put(name, localPath)
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
            name: item.name,
            name_cn: item.name_cn,
            ossUrl: ossUrlList.find(url => url.includes(String(item.id)))
          }
        })
      }
    })
    return newList


  }
}