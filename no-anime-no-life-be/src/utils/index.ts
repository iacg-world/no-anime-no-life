import fs from 'fs'

export const clearImageCache = (pathList: string[]) => {
  setTimeout(() => {
    pathList.forEach(path => {
      fs.rm(path, {}, (err) => {
        console.log(err);

      })
    })
    pathList.length = 0
  }, 1000)
}