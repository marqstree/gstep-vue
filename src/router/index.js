import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: () =>
        import('../views/home/home.vue')
    },
  ]
})

router.beforeEach((to, from, next) => {
  console.log("+++路由回调++++++++++++++++++++++")
  next()
})

export default router
