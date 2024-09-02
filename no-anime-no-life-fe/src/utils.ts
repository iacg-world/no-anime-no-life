import { getFontEmbedCSS, toJpeg } from 'html-to-image'
import { AnimeCategoryInfo, AnimeInfo } from './type'

export function localImg(file: string) {
  return new URL(`./assets/${file}`, import.meta.url).href
}

function download(url: string) {
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.download = decodeURI('nanf')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

}
export async function takeScreenshot(ele: HTMLElement, isDownload: boolean = true) {
  const fontEmbedCss = await getFontEmbedCSS(ele)
  const url = await toJpeg(ele, {
    quality: 0.95,
    width: ele.scrollWidth,
    height: ele.scrollHeight,
    backgroundColor: '#FFFAFA',
    cacheBust: true,
    fontEmbedCSS: fontEmbedCss

  })
  if (url && isDownload) {

    download(url)
  }
  return url

}

export function isMobile(): boolean {
  const userAgent = navigator.userAgent
  return /Android|iPhone|iPad|iPod|BlackBerry|webOS|Windows Phone|SymbianOS|IEMobile|Opera Mini/i.test(userAgent)
}

function checkAnimeItemData(data: AnimeInfo[]) {
  return data.every(item => {
    return item.aid && item.id && item.images
  })

}

export function checkAnimeData(data: AnimeCategoryInfo[]) {
  return data.every(item => {
    return item.categoryId && item.categoryName && checkAnimeItemData(item.list)
  })

}
export function copyToClipboard(textToCopy:string) {
  if (document.execCommand('copy')) {
    // 创建textarea
    const textArea = document.createElement('textarea')
    textArea.value = textToCopy
    // 使textarea不在viewport，同时设置不可见
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    return new Promise((res, rej) => {
      // 执行复制命令并移除文本框
      document.execCommand('copy') ? res(1) : rej()
      textArea.remove()
    })
  } else if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    // navigator clipboard 向剪贴板写文本
    return navigator.clipboard.writeText(textToCopy)
  }
}

export function downloadLink (url:string) {
  const link = document.createElement('a')
  link.href = url
  link.download = 'anime.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
