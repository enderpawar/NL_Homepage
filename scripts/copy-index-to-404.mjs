import fs from 'node:fs/promises'
import path from 'node:path'

const distDir = path.resolve(process.cwd(), 'dist')
const indexHtml = path.join(distDir, 'index.html')
const notFoundHtml = path.join(distDir, '404.html')

await fs.copyFile(indexHtml, notFoundHtml)
console.log('Created dist/404.html from dist/index.html')

