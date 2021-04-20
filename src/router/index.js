import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import NotFound from '@/components/NotFound'

import globals from '@/globals'

// Layouts
import Layout1 from '@/layout/LayoutHorizontalSidenav'

Vue.use(Router)
Vue.use(Meta)

const router = new Router({
  base: '/',
  mode: 'history',
  routes: [{
    path: '/login',
    name: 'login',
    component: () => import('@/components/Login')
  }, {
    path: '/',
    component: Layout1,
    children: [{
      path: '',
      name: 'home',
      component: () => import('@/components/Home')
    }, {
      path: 'monitor',
      name: 'monitor',
      component: () => import('@/components/Monitor')
    }, {
      path: 'usuarios',
      name: 'usuarios',
      component: () => import('@/components/Usuarios')
    }, {
      path: 'tarea',
      name: 'tarea',
      component: () => import('@/components/Tarea')
    }, {
      path: 'detalle_tarea/:task',
      name: 'detalle_tarea',
      component: () => import('@/components/DetalleTarea')
    }, {
      path: 'page-2',
      component: () => import('@/components/Page2')
    }]
  }, {
    // 404 Not Found page
    path: '*',
    component: NotFound
  }]
})

router.afterEach(() => {
  // On small screens collapse sidenav
  if (window.layoutHelpers && window.layoutHelpers.isSmallScreen() && !window.layoutHelpers.isCollapsed()) {
    setTimeout(() => window.layoutHelpers.setCollapsed(true, true), 10)
  }

  // Scroll to top of the page
  globals().scrollTop(0, 0)
})

router.beforeEach((to, from, next) => {
  // Set loading state
  document.body.classList.add('app-loading')

  // Add tiny timeout to finish page transition
  setTimeout(() => next(), 10)
})

export default router
