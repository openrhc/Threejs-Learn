import { onMounted, onUnmounted, Ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export function createThreejsInstance(
  container: Ref<HTMLDivElement | undefined>,
  width: number,
  height: number
) {
  if (!container) {
    throw new Error('未获取到continer,错误')
  }
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000)
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  })
  const controls = new OrbitControls(camera, renderer.domElement)
  const axesHelper = new THREE.AxesHelper(6671393)

  renderer.setSize(width, height)
  controls.enableDamping = true
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN, //左键平移
    MIDDLE: THREE.MOUSE.DOLLY, //滚轮滑动
    RIGHT: THREE.MOUSE.ROTATE, //右键旋转
  }
  // scene.add(axesHelper)

  function onResize() {
    const width = window.innerWidth
    const height = window.innerHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
  }

  function onDblClick() {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      renderer.domElement.requestFullscreen()
    }
  }
  onMounted(() => {
    if (container.value) {
      container.value.appendChild(renderer.domElement)
      window.addEventListener('resize', onResize)
      window.addEventListener('dblclick', onDblClick)
    }
  })

  onUnmounted(() => {
    if (container.value) {
      container.value.removeChild(renderer.domElement)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('dblclick', onDblClick)
    }
  })
  return { scene, camera, renderer, controls, axesHelper }
}
