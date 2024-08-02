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
    });
    this.client = client
  }

}