import html2canvas from 'html2canvas'

export function localImg(file: string) {
  return new URL(`./assets/${file}`, import.meta.url).href
}
function getCanvasBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    })
  })
}

function download(blob: Blob) {
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = URL.createObjectURL(blob)
  link.download = decodeURI('anime.jpg')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

}
export async function takeScreenshot(ele: HTMLElement) {
  const canvas = await html2canvas(ele, {
    width: ele.scrollWidth,
    height: ele.scrollHeight,
    windowWidth: ele.scrollWidth,
    windowHeight: ele.scrollHeight,
    useCORS: true,
    allowTaint: true,
  })
  const blob = await getCanvasBlob(canvas)
  if (blob) {

    download(blob)
  }

}