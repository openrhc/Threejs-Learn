<script lang="ts" setup>
import { ref } from 'vue'
import * as THREE from 'three'
import { TilesRenderer } from '3d-tiles-renderer'

import { createThreejsInstance } from '@/core/three'

// 通用代码
const container = ref<HTMLDivElement>()
const width = window.innerWidth
const height = window.innerHeight

const instance = createThreejsInstance(container, width, height)
const { scene, camera, renderer, controls } = instance

// 业务代码
const RADIUS = 500
camera.position.set(RADIUS, RADIUS, RADIUS)
scene.add(new THREE.AmbientLight(0xffffff, 1))

// 天空盒
scene.background = new THREE.CubeTextureLoader()
  .setPath('texture/sky/')
  .load([
    'right.jpg',
    'left.jpg',
    'top.jpg',
    'down.jpg',
    'back.jpg',
    'front.jpg',
  ])

// 加载灯光
const allLight = new THREE.AmbientLight(0xffffff, 0.3)
allLight.position.set(500, 500, 500)
const light = new THREE.DirectionalLight(0xffffbb, 0.3)
light.position.set(-500, 500, 500)
const sun = new THREE.SpotLight(0x393939, 0.3)
sun.position.set(-500, 500, 500)
scene.add(allLight, light, sun)

// 加载地球
const textureLoader = new THREE.TextureLoader()
const earthGeometry = new THREE.SphereGeometry(RADIUS, 100, 100)
const earchMaterial = new THREE.MeshPhongMaterial({
  specular: 0x404040,
  // transparent: true,
  // opacity: 0.2,
  shininess: 5,
  map: textureLoader.load('/texture/earth/earth.jpg'),
  specularMap: textureLoader.load('/texture/earth/earth_spec.jpg'),
  bumpMap: textureLoader.load('/texture/earth/earth_bump.jpg'),
})
const earchMesh = new THREE.Mesh(earthGeometry, earchMaterial)
scene.add(earchMesh)

// 加载云层
const cloudGemoetry = new THREE.SphereGeometry(RADIUS + 20, 100, 100)
const cloudMaterial = new THREE.MeshPhongMaterial({
  alphaMap: textureLoader.load('/texture/earth/clouds.jpg'),
  transparent: true,
  opacity: 1,
})
const cloudMesh = new THREE.Mesh(cloudGemoetry, cloudMaterial)
scene.add(cloudMesh)

// 加载倾斜摄影
const tilesRendererArr: TilesRenderer[] = []
async function load3DTiles(options: {
  baseUrl: string
  fileName: string
  position: [number, number, number]
}) {
  const res = await fetch(options.baseUrl + options.fileName)
  const json = await res.json()
  if (!json.root.children) return
  for (const children of json.root.children) {
    if (children.children) {
      for (const tiles of children.children) {
        const uri = tiles.content.uri as string
        const arr = uri.split('/')
        const fileName = arr.pop()!
        load3DTiles({
          baseUrl: options.baseUrl + arr.join('/') + '/',
          fileName: fileName,
          position: options.position,
        })
      }
    } else if (children.content) {
      const tilesRenderer = new TilesRenderer(
        options.baseUrl + children.content.uri
      )
      tilesRenderer.setCamera(camera)
      tilesRenderer.setResolutionFromRenderer(camera, renderer)
      const tilesObj = tilesRenderer.group
      tilesObj.rotation.set(-Math.PI / 2, 0, 0)
      tilesObj.position.set(...options.position)
      scene.add(tilesObj)
      tilesRendererArr.push(tilesRenderer)
    }
  }
}

load3DTiles({
  // 'http://192.168.110.70:9002/model/20199fb0fc3111eca5b3d9707210ef59/' // 尤渡苑
  baseUrl: 'http://192.168.110.70:9002/model/f039c3b0fc3011eca5b3d9707210ef59/', // 毛岸新苑
  fileName: 'tileset.json',
  position: [0, RADIUS, 0],
})

function render() {
  requestAnimationFrame(render)
  earchMesh.rotation.y += 0.01
  cloudMesh.rotation.y += 0.02
  controls.update()
  camera.updateMatrixWorld()
  for (const tilesRenderer of tilesRendererArr) {
    tilesRenderer.update()
  }
  renderer.render(scene, camera)
}

render()
</script>

<template>
  <div ref="container"></div>
</template>

<style scoped></style>
