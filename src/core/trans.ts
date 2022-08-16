import { MathUtils } from 'three'

export function Point(lng: number, lat: number, radius: number) {
  const lg = MathUtils.degToRad(lng),
    lt = MathUtils.degToRad(lat)
  const y = radius * Math.sin(lt)
  const temp = radius * Math.cos(lt)
  const x = temp * Math.sin(lg)
  const z = temp * Math.cos(lg)
  return { x: x, y: y, z: z }
}
