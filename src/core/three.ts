import { onMounted, onUnmounted, Ref } from 'vue'
import * as THREE from 'three'

/**
 * 创建threejs实例
 * @param container 实例容器
 * @param width 容器宽度
 * @param height 容器高度
 * @param animation 实例动画函数
 * @returns
 */
export function createThreejsInstance(
  container: Ref<HTMLDivElement | undefined>,
  width: number,
  height: number,
  animation: (time: number) => void
) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 20000)

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  })
  renderer.setSize(width, height)
  renderer.setAnimationLoop(animation)

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
  return { scene, camera, renderer }
}
