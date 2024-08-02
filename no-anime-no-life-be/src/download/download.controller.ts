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
  private cachePaths = []
  constructor(
    private readonly downloadService: DownloadService,
    private readonly oss: OssService
  ) {

  }

  @Post()
  async downloadImage(@Body() list: AnimeCategoryInfo[]) {
    try {
      const localImgList = await this.downloadService.download(list)
      const promiseArr: Promise<any>[] = []


      localImgList.forEach(async ({ cacheFileName, ossFileName, ossUrl }) => {

        const localPath = `${imagePath}/${cacheFileName}`
        if (!ossUrl) {
          this.cachePaths.push(localPath)
        }
        const p = ossUrl ? asyncUrl(ossUrl) : this.oss.client.put(ossFileName, localPath)
        promiseArr.push(p)

      })


      const res: { url: string }[] = await Promise.all(promiseArr)
      const ossUrlList = res.map(item => item.url)

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

    } catch (error) {
      console.log(error);


    } finally {
      clearImageCache(this.cachePaths)

    }

  }
}