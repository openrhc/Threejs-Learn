import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    name: '主页',
    path: '/',
    component: () => import('@/components/HelloWorld.vue'),
  },
  {
    name: '场景',
    path: '/scene',
    component: () => import('@/components/01-Scene.vue'),
  },
  {
    name: '物体移动',
    path: '/move',
    component: () => import('@/components/01-Move.vue'),
  },
]

export default routes
