export function localImg(file: string) {
  return new URL(`./assets/${file}`, import.meta.url).href
}