import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import vitePluginImp from 'vite-plugin-imp'
import compression from 'vite-plugin-compression'
// https://vitejs.dev/config/
export default defineConfig(() => {
  const envPath = path.dirname(__dirname)

  return {
    envPrefix: 'NANF',
    build: {
      outDir: path.join(envPath, 'no-anime-no-life-be/dist/fe-dist'),
      emptyOutDir: true,
    },


    envDir: envPath,
    plugins: [
      compression({
        verbose: true,
        disable: false,
        threshold: 10 * 1024, // 压缩阈值，小于这个值的文件将不会被压缩（单位为字节）这里就是大于 10kb 菜压缩
        algorithm: 'gzip', // 压缩算法
        ext: '.gz', // 压缩文件后缀名
      }),
      react(),
      vitePluginImp({
        libList: [
          {
            libName: '@nutui/nutui-react',
            style: (name) => {
              return `@nutui/nutui-react/dist/esm/${name}/style/css`
            },
            replaceOldImport: false,
            camel2DashComponentName: false,
          }
        ]
      }),
    ],
    // 别名配置
    resolve: {

    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true
        }
      },

    }

  }
})
