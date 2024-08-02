import { Injectable } from "@nestjs/common";
import OSS from 'ali-oss'


@Injectable()
export class OssService {
  public client
  constructor() {

    const client = new OSS({
      region: 'oss-cn-shenzhen', // 示例：'oss-cn-hangzhou'，填写Bucket所在地域。
      accessKeyId: process.env.ALC_ACCESS_KEY, // 确保已设置环境变量ALC_ACCESS_KEY。
      accessKeySecret: process.env.ALC_SECRET_KEY, // 确保已设置环境变量ALC_SECRET_KEY。
      bucket: 'no-anime-no-life', // 示例：'my-bucket-name'，填写存储空间名称。
      secure: true,
      retryMax: 10
    });
    this.client = client
  }
  async isExistObject(name) {
    try {
      const data = await this.client.head(name, {
        timeout: 5 * 1000
      });
      if (data&&data.res&& data.res.status === 200) {
        return data.res.requestUrls[0]
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

}