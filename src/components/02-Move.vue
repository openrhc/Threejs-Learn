<script lang="ts" setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { onMounted, ref } from 'vue'

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
cube.position.set(1, 1, 1)

// 04 将cube添加到场景
scene.add(cube)

// 05 初始化渲染器
const renderer = new THREE.WebGLRenderer()

// 设置渲染器大小
renderer.setSize(width, height)

// 渲染
render()

onMounted(() => {
  // 添加到网页
  container.value!.appendChild(renderer.domElement)
})

// 轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

function render() {
  // 通过相机渲染场景
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}
</script>

<template>
  <div ref="container"></div>
</template>

<style scoped></style>
