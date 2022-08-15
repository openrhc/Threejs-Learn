import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    name: '主页',
    path: '/',
    component: () => import('@/components/HelloWorld.vue'),
  },
  {
    name: '练习',
    path: '/practice',
    component: () => import('@/components/Practice.vue'),
  },
  {
    name: '场景',
    path: '/scene',
    component: () => import('@/components/01-Scene.vue'),
  },
  {
    name: 'Gsap',
    path: '/gsap',
    component: () => import('@/components/02-Gsap.vue'),
  },
]

export default routes
