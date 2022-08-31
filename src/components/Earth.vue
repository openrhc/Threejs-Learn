<script lang="ts" setup>
import { ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
import { createThreejsInstance } from '@/core/three'

const container = ref<HTMLDivElement>()
const width = window.innerWidth
const height = window.innerHeight

const instance = createThreejsInstance(container, width, height, animation)
const { scene, camera, renderer } = instance

// 业务代码
const planet = ref(0)
const EARTH_RADIUS = 50
const SUN_RADIUS = EARTH_RADIUS * 109
camera.position.set(SUN_RADIUS * 2, 0, SUN_RADIUS * 2)
scene.add(new THREE.AmbientLight(0xffffff, 1))

// scene.add(new THREE.AxesHelper(SUN_RADIUS * 2))

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target = new THREE.Vector3(0, 0, 0)

// 天空盒
// scene.background = new THREE.CubeTextureLoader()
//   .setPath('texture/sky/')
//   .load([
//     'right.jpg',
//     'left.jpg',
//     'top.jpg',
//     'down.jpg',
//     'back.jpg',
//     'front.jpg',
//   ])

// 加载灯光
const allLight = new THREE.AmbientLight(0xffffff, 0.3)
allLight.position.set(500, 500, 500)
const light = new THREE.DirectionalLight(0xffffbb, 0.3)
light.position.set(-500, 500, 500)
const sun = new THREE.SpotLight(0x393939, 0.3)
sun.position.set(-500, 500, 500)
scene.add(allLight, light, sun)

//加载管理器
const loadingManager = new THREE.LoadingManager(
  () => {
    console.log('加载完成')
  },
  (url, loaded, total) => {
    console.log('加载进度 :>> ', url, loaded, total)
  },
  (error) => {
    console.log('error :>> ', error)
  }
)

// 加载地球
const textureLoader = new THREE.TextureLoader(loadingManager)
const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 100, 100)
const earchMaterial = new THREE.MeshStandardMaterial({
  map: textureLoader.load('/texture/planet/8k_earth_daymap.jpg'),
  normalMap: textureLoader.load('/texture/planet/8k_earth_normal_map.jpg'),
  normalScale: new THREE.Vector2(1, 1),
})
const earthMesh = new THREE.Mesh(earthGeometry, earchMaterial)
earthMesh.position.set(1521 * 108, 0, 1521 * 108)
scene.add(earthMesh)

textureLoader
  .loadAsync('/texture/planet/8k_stars_milky_way.jpg')
  .then((texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
  })

// 加载云层
const cloudGemoetry = new THREE.SphereGeometry(
  EARTH_RADIUS + EARTH_RADIUS * 0.05,
  100,
  100
)
const cloudMaterial = new THREE.MeshPhongMaterial({
  alphaMap: textureLoader.load('/texture/planet/8k_earth_clouds.jpg'),
  transparent: true,
  opacity: 0.6,
})
const cloudMesh = new THREE.Mesh(cloudGemoetry, cloudMaterial)
cloudMesh.position.set(1521 * 108, 0, 1521 * 108)
scene.add(cloudMesh)

// 太阳
const sunGeometry = new THREE.SphereGeometry(SUN_RADIUS, 100, 100)
const sunMaterial = new THREE.MeshStandardMaterial({
  map: textureLoader.load('/texture/planet/8k_sun.jpg'),
})
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial)
scene.add(sunMesh)

// 动画
gsap.to(earthMesh.rotation, {
  y: Math.PI * 2,
  duration: 5,
  ease: 'power0',
  repeat: -1,
})
gsap.to(cloudMesh.rotation, {
  y: Math.PI * 2,
  duration: 6,
  ease: 'power0',
  repeat: -1,
})

gsap.to(sunMesh.rotation, {
  y: Math.PI * 2,
  duration: 10,
  ease: 'power0',
  repeat: -1,
})

let degree = 0
function animation(time: number) {
  const d = -(++degree * Math.PI) / 180
  const x = Math.cos(d) * (SUN_RADIUS * 2)
  const y = Math.sin(d) * (SUN_RADIUS * 2)
  earthMesh.position.set(x, 0, y)
  cloudMesh.position.set(x, 0, y)
  if (planet.value === 0) {
    camera.position.copy(sunMesh.position)
    camera.translateZ(SUN_RADIUS * 3)
  } else if (planet.value === 1) {
    camera.position.copy(earthMesh.position)
    camera.translateZ(EARTH_RADIUS * 3)
  }
  controls.update()
  camera.updateMatrixWorld()
  renderer.render(scene, camera)
}
</script>

<template>
  <div ref="container"></div>
  <div class="btn">
    <button @click="planet = 0">锁定到太阳</button>
    <button @click="planet = 1">锁定到地球</button>
  </div>
</template>

<style scoped>
.btn {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
