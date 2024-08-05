import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const envPath = path.dirname(__dirname)

  return {
    envPrefix: 'NANF',
    build: {
      outDir: path.join(envPath, 'no-anime-no-life-be/dist'),
      assetsDir: 'fe-dist',
    },


    envDir: envPath,
    plugins: [react()],
    // 别名配置
    resolve: {

    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true
        }
      }
    }

  }
})
