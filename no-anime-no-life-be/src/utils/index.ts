import fs from 'fs'

export const clearImageCache = (pathList:string[]) => {
  pathList.forEach(path => {
    fs.rm(path, () => {})
  })
  pathList.length = 0
}