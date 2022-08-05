<script lang="ts" setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { onMounted, ref } from 'vue'

const fps = ref(0)
const container = ref<HTMLDivElement>()

const width = window.innerWidth
const height = window.innerHeight

// 01 创建场景
const scene = new THREE.Scene()

// 02 创建相机
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)

// 设置相机位置
camera.position.set(0, 0, 10)

// 添加到场景
// scene.add(camera)

// 03 创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
// 材质
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

// cube.position.setX(1)
// cube.position.set(1, 1, 1)

// 04 将cube添加到场景
scene.add(cube)

// 05 初始化渲染器
const renderer = new THREE.WebGLRenderer()

// 设置渲染器大小
renderer.setSize(width, height)

const clock = new THREE.Clock()

// 渲染
render(0)

onMounted(() => {
  // 添加到网页
  container.value!.appendChild(renderer.domElement)
})

// 轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.target = new THREE.Vector3(1, 1, 1)
// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

function render(time: number) {
  fps.value = Math.floor(1 / clock.getDelta())
  let t = clock.getElapsedTime()
  cube.position.x = (t * 0.8) % 5

  //   cube.position.x += 0.01
  //   cube.scale.x = 3
  //   if (cube.position.x > 5) cube.position.x = 0
  //   cube.rotation.x += 0.1
  //   cube.rotation.y += 0.1
  //   cube.rotation.z += 0.1

  // 通过相机渲染场景
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}
</script>

<template>
  <div class="fps">FPS: {{ fps }}</div>
  <div ref="container"></div>
</template>

<style scoped>
.fps {
  position: fixed;
  color: #fff;
  right: 0;
  top: 0;
}
</style>
