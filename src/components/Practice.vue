<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { GUI } from 'dat-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const width = window.innerWidth
const height = window.innerHeight

const gui = new GUI()

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)

camera.position.set(5, 5, 10)

const meshList: THREE.Mesh[] = []

function addBufferGeometry() {
  for (let i = 0; i < Math.floor(Math.random() * 100); i++) {
    const geometry = new THREE.BufferGeometry()
    const positionArray = new Float32Array(9)
    for (let j = 0; j < 9; j++) {
      positionArray[j] = Math.random() * 10 - 5
    }

    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positionArray, 3)
    )
    let color = new THREE.Color(Math.random(), Math.random(), Math.random())
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.5,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    meshList.push(mesh)
  }
}

function removeBufferGeometry() {
  meshList.forEach((mesh) => {
    scene.remove(mesh)
  })
  meshList.splice(0)
}

scene.add(new THREE.AxesHelper(10))

let boxMeshList: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>[] =
  []

function addBoxBufferGeometry() {
  if (boxMeshList.length) return

  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load('/texture/gold01.png')
  // const alphaTexture = textureLoader.load('/texture/alpha.png')
  const aoTexture = textureLoader.load('/texture/ao.png')
  const heightTexture = textureLoader.load('/texture/height.png')
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true,
    // alphaMap: alphaTexture,
    aoMap: aoTexture,
    aoMapIntensity: 1.5,
    side: THREE.DoubleSide,
    displacementMap: heightTexture,
    displacementScale: 0.05,
  })

  // const light = new THREE.AmbientLight()
  // scene.add(light)
  const directionalLight = new THREE.DirectionalLight()
  directionalLight.position.set(10, 10, 10)
  scene.add(directionalLight)

  for (let i = 0; i < 2; i++) {
    const cubeBoxGeometry = new THREE.BoxBufferGeometry(2, 2, 2, 100, 100)
    // texture.offset.x = 0.5
    // texture.offset.y = 0.5
    // texture.center.set(0.5, 0.5)
    // texture.rotation = Math.PI / 4
    // texture.wrapS = THREE.RepeatWrapping
    // texture.wrapT = THREE.RepeatWrapping
    // texture.repeat.set(5, 2)
    // texture.minFilter = THREE.NearestFilter
    // texture.magFilter = THREE.NearestFilter
    cubeBoxGeometry.setAttribute(
      'uv2',
      new THREE.BufferAttribute(cubeBoxGeometry.attributes.uv.array, 2)
    )
    const mesh = new THREE.Mesh(cubeBoxGeometry, material)
    mesh.position.y = i * 2 + i
    boxMeshList.push(mesh)
    scene.add(mesh)
  }
}
function removeBoxBufferGeometry() {
  boxMeshList.forEach((mesh) => {
    scene.remove(mesh)
  })
  boxMeshList.splice(0)
}
function changeTexture() {
  const texture = new THREE.TextureLoader()
  boxMeshList.forEach((mesh) => {
    mesh.material.map = texture.load('/texture/gold.png')
  })
}

const params = {
  addBufferGeometry,
  removeBufferGeometry,
  addBoxBufferGeometry,
  removeBoxBufferGeometry,
  changeTexture,
}

const folder1 = gui.addFolder('BufferGeometry')
folder1.add(params, 'addBufferGeometry')
folder1.add(params, 'removeBufferGeometry')

const folder2 = gui.addFolder('纹理')
folder2.add(params, 'addBoxBufferGeometry')
folder2.add(params, 'removeBoxBufferGeometry')
folder2.add(params, 'changeTexture')

addBoxBufferGeometry()

const renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

controls.target = new THREE.Vector3(0, 0, 0)

function anim() {
  meshList.forEach((mesh) => {
    mesh.rotation.x += 0.01
    mesh.rotation.y += 0.01
    mesh.rotation.z += 0.01
  })
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(anim)
}

anim()

onMounted(() => {
  document.body.appendChild(renderer.domElement)
})

onUnmounted(() => {
  document.body.removeChild(renderer.domElement)
  gui.destroy()
})
</script>
<template></template>
<style lang="less" scoped></style>
