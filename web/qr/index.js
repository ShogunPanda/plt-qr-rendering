import { createServer } from 'node:http'
import QRCodeGenerator from 'qrcode-generator'
import {
  drawAlignment,
  drawCircle,
  drawFinder,
  getAlignments,
  isAlignment,
  isFinder,
  padding,
  unit
} from './rendering.js'

export function create() {
  return createServer((req, res) => {
    const data = req.url.split('/').at(-1)
    const url = Buffer.from(data, 'base64url').toString('utf-8')

    const qr = QRCodeGenerator(0, 'H')
    qr.addData(url)
    qr.make()

    const modules = qr.getModuleCount()
    const aligments = getAlignments(modules)
    const dimension = modules * unit + padding
    let svgPath = ''
    let svgPoints = ''

    // Draw regular modules
    for (let x = 0; x < modules; x++) {
      for (let y = 0; y < modules; y++) {
        if (!qr.isDark(y, x) || isFinder(modules, y, x) || isAlignment(aligments, y, x)) {
          continue
        }

        svgPoints += drawCircle(x, y)
      }
    }
    svgPath += `<path d="${svgPoints}" fill="currentColor" stroke="none" />`

    // Draw the finders
    svgPath += drawFinder(0, 0)
    svgPath += drawFinder(modules - 7, 0)
    svgPath += drawFinder(0, modules - 7)

    // Draw the aligments
    for (const aligment of aligments) {
      svgPath += drawAlignment(aligment[0], aligment[1])
    }

    res.writeHead(200, { 'x-plt-qr': url, 'content-type': 'image/svg+xml' })
    res.end(`
        <svg 
          xmlns="http://www.w3.org/2000/svg" version="1.1" 
          width="${dimension}" height="${dimension}" viewBox="0 0 ${dimension} ${dimension}"
        >
          ${svgPath}
        </svg>
      `)
  })
}
