<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Mesh } from 'three'

const width = window.innerWidth
const height = window.innerHeight

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
camera.position.set(5, 5, 10)

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(10))

const renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)
renderer.setAnimationLoop(animation)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target = new THREE.Vector3(0, 0, 0)

const envMapTexture = new THREE.CubeTextureLoader()
  .setPath('texture/sky/')
  .load([
    'right.jpg',
    'left.jpg',
    'top.jpg',
    'down.jpg',
    'back.jpg',
    'front.jpg',
  ])

scene.background = envMapTexture

const light = new THREE.AmbientLight(0xffffff, 1)
scene.add(light)
// 默认环境贴图
scene.environment = envMapTexture

const sphere = new Mesh(
  new THREE.SphereGeometry(1, 40, 40),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.6,
    roughness: 0.1,
    envMap: envMapTexture,
  })
)
sphere.position.y = 2
scene.add(sphere)

function animation() {
  renderer.render(scene, camera)
  controls.update()
}

onMounted(() => {
  document.body.appendChild(renderer.domElement)
})

onUnmounted(() => {
  document.body.removeChild(renderer.domElement)
})
</script>
<template></template>
<style lang="less" scoped></style>
