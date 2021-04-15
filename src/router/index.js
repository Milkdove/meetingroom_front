import Vue from 'vue'
import Router from 'vue-router'


import Login from '@/components/Login'
import Home from '@/components/Home'

import addorganization from '@/components/organization/addorganization'
import rmorganization from '@/components/organization/rmorganization'
import usermanager from '@/components/organization/usermanager'
import userapply from '@/components/organization/userapply'

import addroom from '@/components/meetingroom/addroom'
import rmroom from '@/components/meetingroom/rmroom'
import editroom from '@/components/meetingroom/editroom'


import bookroom from '@/components/application/bookroom'
import canclebook from '@/components/application/canclebook'
import queryroom from '@/components/application/queryroom'

import myinfo from '@/components/userinfo/myinfo'
import mybook from '@/components/userinfo/mybook'
import myorganization from '@/components/userinfo/myorganization'


Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/myinfo',
      children: [
        {
          path: '/myinfo',
          component: myinfo
        },
        {
          path: '/myorganization',
          component: myorganization
        },
        {
          path: '/mybook',
          component: mybook
        },

        {
          path: '/addorganization',
          component: addorganization
        },
        {
          path: '/rmorganization',
          component: rmorganization
        },
        {
          path: '/userapply',
          component: userapply
        },
        {
          path: '/addroom',
          component: addroom
        },
        {
          path: '/rmroom',
          component: rmroom
        },
        {
          path: '/editroom',
          component: editroom
        },
        {
          path: '/usermanager',
          component: usermanager
        },
        {
          path: '/bookroom',
          component: bookroom
        },
        {
          path: '/queryroom',
          component: queryroom
        },
        {
          path: '/canclebook',
          component: canclebook
        }
      ]
    }
  ]
})

//挂载路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next();
})


export default router
