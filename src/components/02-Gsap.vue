<script lang="ts" setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

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
  window.addEventListener('resize', () => {
    // camera
    const width = window.innerWidth
    const height = window.innerHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    // renderer
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
  })
  window.addEventListener('dblclick', () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      renderer.domElement.requestFullscreen()
    }
  })
})

// 轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.target = new THREE.Vector3(1, 1, 1)
// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 设置动画
gsap.to(cube.position, {
  x: 5,
  duration: 1,
  ease: 'power1.inOut',
  repeat: Infinity,
  onComplete: () => {
    console.log('done')
  },
})
gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 5, repeat: 2 })

function render(time: number) {
  // 通过相机渲染场景
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}
</script>

<template>
  <div ref="container"></div>
</template>

<style scoped></style>
