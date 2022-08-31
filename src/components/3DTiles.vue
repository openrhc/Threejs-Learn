<script lang="ts" setup>
import { ref } from 'vue'
import * as THREE from 'three'
import { TilesRenderer } from '3d-tiles-renderer'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { createThreejsInstance } from '@/core/three'

// 通用代码
const container = ref<HTMLDivElement>()
const width = window.innerWidth
const height = window.innerHeight

const instance = createThreejsInstance(container, width, height, animation)
const { scene, camera, renderer } = instance

// 业务代码
camera.position.set(200, 200, 200)
scene.background = new THREE.Color(0xffffff)
scene.add(new THREE.AmbientLight(0xffffff, 1))

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const light = new THREE.AmbientLight(0xffffff, 1)
scene.add(light)

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
  baseUrl: 'http://192.168.110.70:9002/model/20199fb0fc3111eca5b3d9707210ef59/', // 尤渡苑
  // baseUrl: 'http://192.168.110.70:9002/model/f039c3b0fc3011eca5b3d9707210ef59/', // 毛岸新苑
  fileName: 'tileset.json',
  position: [0, 0, 0],
})

function animation() {
  for (const tilesRenderer of tilesRendererArr) {
    tilesRenderer.update()
  }
  controls.update()
  camera.updateMatrixWorld()
  renderer.render(scene, camera)
}
</script>

<template>
  <div ref="container"></div>
</template>

<style scoped></style>
