/* eslint-disable @typescript-eslint/ban-ts-comment */
/*eslint no-useless-catch: "off"*/
// @ts-nocheck

import { nanoid } from 'nanoid'
import { AnimeCategoryInfo } from './type'

const client = new OSS({
  region: 'oss-cn-shenzhen', // 示例：'oss-cn-hangzhou'，填写Bucket所在地域。
  accessKeyId: import.meta.env.NANF_ALC_ACCESS_KEY, // 确保已设置环境变量ALC_ACCESS_KEY。
  accessKeySecret: import.meta.env.NANF_ALC_SECRET_KEY, // 确保已设置环境变量ALC_SECRET_KEY。
  bucket: 'no-anime-no-life', // 示例：'my-bucket-name'，填写存储空间名称。
  secure: true,
})

export async function uploadAnimeJSON(animeList: AnimeCategoryInfo[]) {
  try {
    const jsonString = JSON.stringify(animeList)
 
    // 创建Blob对象
    const blob = new Blob([jsonString], { type: 'application/json' })
 
    // 创建FormData并添加文件
    const name = `${nanoid()}_anime.json`
    const {res} = await client.put(name, blob)
    if (res.statusCode === 200) {
      const response = {
        'content-disposition': `attachment; filename=${encodeURIComponent(
          'anime.json'
        )}`,
      }
      const downloadUrl = await client.signatureUrl(name, { response })
      return downloadUrl
    } else {
      throw '保存失败'
    }
  } catch (e) {
    throw e
  }
}