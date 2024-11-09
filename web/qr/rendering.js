export const padding = 1
const radius = 5
const diameter = radius * 2 // This is also the stroke width - Consider that all the strokes consider as origin its middle point
export const unit = diameter + padding * 2 // This is the grid unit
const rectCornerSize = diameter + radius // Because you specify the diameter in the paths and then have to consider half the stroke width, which is the radius

const alignmentsByVersion = [
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
  [6, 30, 54],
  [6, 32, 58],
  [6, 34, 62],
  [6, 26, 46, 66],
  [6, 26, 48, 70],
  [6, 26, 50, 74],
  [6, 30, 54, 78],
  [6, 30, 56, 82],
  [6, 30, 58, 86],
  [6, 34, 62, 90],
  [6, 28, 50, 72, 94],
  [6, 26, 50, 74, 98],
  [6, 30, 54, 78, 102],
  [6, 28, 54, 80, 106],
  [6, 32, 58, 84, 110],
  [6, 30, 58, 86, 114],
  [6, 34, 62, 90, 118],
  [6, 26, 50, 74, 98, 122],
  [6, 30, 54, 78, 102, 126],
  [6, 26, 52, 78, 104, 130],
  [6, 30, 56, 82, 108, 134],
  [6, 34, 60, 86, 112, 138],
  [6, 30, 58, 86, 114, 142],
  [6, 34, 62, 90, 118, 146],
  [6, 30, 54, 78, 102, 126, 150],
  [6, 24, 50, 76, 102, 128, 154],
  [6, 28, 54, 80, 106, 132, 158],
  [6, 32, 58, 84, 110, 136, 162],
  [6, 26, 54, 82, 110, 138, 166],
  [6, 30, 58, 86, 114, 142, 170]
]

export function getAlignments(modules) {
  const version = (modules - 17) / 4
  const aligments = []

  const currentAlignments = alignmentsByVersion[version - 1]
  for (const i of currentAlignments) {
    for (const j of currentAlignments) {
      if (isFinder(modules, i, j)) {
        // Skip the one overlapping with finders
        continue
      }

      aligments.push([i - 2, j - 2])
    }
  }

  return aligments
}

export function isFinder(modules, y, x) {
  return (
    (y < 7 && (x < 7 || x > modules - 8)) || // Top corners
    (y > modules - 8 && x < 7) // Bottom left corner
  )
}

export function isAlignment(aligments, y, x) {
  return aligments.some(([topLevelY, topLevelX]) => {
    return y >= topLevelY && y <= topLevelY + 4 && x >= topLevelX && x <= topLevelX + 4
  })
}

/*
  Draw the corners and aligments.

  For all this consider the stroke is radius * 2 to align with dots, and that the stroke is
  drawn half inside and half outside the border (and the boundaries).
*/
export function drawFinder(x, y, size = 7, innerSizeModifier = 4) {
  const outerTotalSize = size * unit - padding * 2
  const outerSideSize = outerTotalSize - rectCornerSize * 2
  const outerPositionX = unit * x + padding + radius + diameter // Move right to exclude the top-left corner
  const outerPositionY = unit * y + padding + radius

  const innerTotalSize = (size - innerSizeModifier) * unit + diameter - padding * 2 // Add the diameter manually as stroke is not used here
  const innerSideSize = innerTotalSize - rectCornerSize * 2
  const innerPositionX = unit * (x + innerSizeModifier / 2) + padding + diameter // Move right to exclude the top-left corner
  const innerPositionY = unit * (y + innerSizeModifier / 2) + padding

  const outer = [
    `M${outerPositionX},${outerPositionY}`, // Move to the origin of the outer rectangle
    `h${outerSideSize}`, // Draw the top line
    `s${diameter},0,${diameter},${diameter}`, // Draw the top right border -> Parameters are the control point and the ending point
    `v${outerSideSize}`, // Draw the right line
    `s0,${diameter},-${diameter},${diameter}`, // Draw the top right border
    `h-${outerSideSize}`, // Draw the bottom line
    `s-${diameter},0,${-diameter},${-diameter}`, // Draw the top right border
    `v-${outerSideSize}`, // Draw the top line
    `s0,-${diameter},${diameter},-${diameter}`, // Draw the top left border
    ''
  ]

  const inner = [
    `M${innerPositionX},${innerPositionY}`, // Move to the origin of the inner rectangle
    `h${innerSideSize}`, // Draw the top line
    `s${diameter},0,${diameter},${diameter}`, // Draw the top right border -> Parameters are the control point and the ending point
    `v${innerSideSize}`, // Draw the right line
    `s0,${diameter},-${diameter},${diameter}`, // Draw the top right border
    `h-${innerSideSize}`, // Draw the bottom line
    `s-${diameter},0,${-diameter},${-diameter}`, // Draw the top right border
    `v-${innerSideSize}`, // Draw the top line
    `s0,-${diameter},${diameter},-${diameter}`, // Draw the top left border
    ''
  ]

  return `
    <path d="${outer.join(' ')}" fill="none" stroke="currentColor" stroke-width="${diameter}" />
    <path d="${inner.join(' ')}" fill="currentColor" stroke="none" />
  `
}

export function drawAlignment(x, y, size = 5) {
  const outerTotalSize = size * unit - padding * 2
  const outerSideSize = outerTotalSize - rectCornerSize * 2
  const outerPositionX = unit * x + padding + radius + diameter // Move right to exclude the top-left corner
  const outerPositionY = unit * y + padding + radius

  const circlePositionX = unit * (x + 2) + padding
  const circlePositionY = unit * (y + 2) + padding + radius

  // const circlePosition =
  const outer = [
    `M${outerPositionX},${outerPositionY}`, // Move to the origin of the outer rectangle
    `h${outerSideSize}`, // Draw the top line
    `s${diameter},0,${diameter},${diameter}`, // Draw the top right border -> Parameters are the control point and the ending point
    `v${outerSideSize}`, // Draw the right line
    `s0,${diameter},-${diameter},${diameter}`, // Draw the top right border
    `h-${outerSideSize}`, // Draw the bottom line
    `s-${diameter},0,${-diameter},${-diameter}`, // Draw the top right border
    `v-${outerSideSize}`, // Draw the top line
    `s0,-${diameter},${diameter},-${diameter}`, // Draw the top left border
    ''
  ]

  const circle = [
    `M${circlePositionX},${circlePositionY}`, // Move to the origin of the inner rectangle
    `a${radius},${radius},0,1,0,${diameter},0 a${radius},${radius},0,1,0,${-diameter},0` // Draw the circle
  ]

  return `
    <path d="${outer.join(' ')}" fill="none" stroke="currentColor" stroke-width="${diameter}" />
    <path d="${circle.join(' ')}" fill="currentColor" stroke="none" />
  `
}

export function drawCircle(x, y) {
  const positionX = padding + x * unit
  const positionY = padding + y * unit + radius

  return `M${positionX},${positionY} a${radius},${radius},0,1,0,${diameter},0 a${radius},${radius},0,1,0,${-diameter},0 `
}
