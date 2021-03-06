import Vue from 'vue'
import Router from 'vue-router'


import Login from '@/components/Login'
import Home from '@/components/Home'

import addorganization from '@/components/organization/addorganization'
import rmorganization from '@/components/organization/rmorganization'
import usermanager from '@/components/organization/usermanager'
import userapply from '@/components/organization/userapply'

import roomList from '@/components/meetingroom/roomList'

import bookroom from '@/components/application/bookroom'
import querymeeting from '@/components/application/querymeeting'

import myinfo from '@/components/userinfo/myinfo'
import mymeeting from '@/components/userinfo/mymeeting'
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
      meta: {
        requireAdmin: true,
      },
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
          path: '/mymeeting',
          component: mymeeting
        },

        {
          path: '/addorganization',
          component: addorganization,
          meta: {
            requireAdmin: true
          }
        },
        {
          path: '/rmorganization',
          component: rmorganization,
          meta: {
            requireAdmin: true
          }
        },
        {
          path: '/userapply',
          component: userapply,
          meta: {
            requireAdmin: true
          }
        },
        {
          path: '/roomList',
          component: roomList,
          meta: {
            requireAdmin: true
          }
        },
        {
          path: '/usermanager',
          component: usermanager,
          meta: {
            requireAdmin: true
          }
        },
        {
          path: '/bookroom',
          component: bookroom
        },
        {
          path: '/querymeeting',
          component: querymeeting
        },
      ]
    }
  ]
})

//??????????????????
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  //??????token
  const tokenStr = window.sessionStorage.getItem('token')
  //??????????????????
  const user_role = window.sessionStorage.getItem("user_role")
  //????????????????????????
  if (!tokenStr) return next('/login')
  //??????????????????
  if ((to.meta.requireAdmin) && (user_role !== '0')) {
    alert('???????????????!,???????????????????????????')
    return next(from.path);
  }
  next();
})


export default router
