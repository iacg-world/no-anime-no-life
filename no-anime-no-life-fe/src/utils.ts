import { toJpeg } from 'html-to-image'

export function localImg(file: string) {
  return new URL(`./assets/${file}`, import.meta.url).href
}

function download(url: string) {
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.download = decodeURI('动画人生')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

}
export async function takeScreenshot(ele: HTMLElement) {
  const url = await toJpeg(ele, {
    quality: 1,
    width: ele.scrollWidth,
    height: ele.scrollHeight,
    backgroundColor: '#FFFAFA',
    skipAutoScale: true,

  })
  if (url) {

    download(url)
  }

}