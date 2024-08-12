import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import vitePluginImp from 'vite-plugin-imp'

// import px2rem from 'postcss-pxtorem'
// https://vitejs.dev/config/
export default defineConfig(() => {
  const envPath = path.dirname(__dirname)

  return {
    envPrefix: 'NANF',
    build: {
      outDir: path.join(envPath, 'no-anime-no-life-be/dist'),
      assetsDir: 'fe-dist',
    },


    envDir: envPath,
    plugins: [
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
