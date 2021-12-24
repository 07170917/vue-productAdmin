import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { getAuthMenu } from '@/api/user'
import Layout from '@/layout'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          await getAuthMenu().then(response => {
            if (response.data.permissionsList.length < 1) {
              global.antRouter = []
              next()
            }
            const menus = filterAsyncRouter(response.data.permissionsList) // 1.过滤路由
            menus.push({ path: '*', redirect: '/404', hidden: true }) //必须要将404的路由加在动态路由的后面，否则登录成功后刷新页面会出现404
            router.options.routes=router.options.routes.concat(menus)//先添加数据到router.options,addRouter方法不会添加
            router.addRoutes(menus) // 2.动态添加路由
            global.antRouter = menus // 3.将路由数据传递给全局变量，做侧边栏菜单渲染工作
            next({
              ...to,
              replace: true
            }) // hack方法 确保addRoutes已完成 ,set the replace
          }).catch((error)=>{
            console.log(error)
            next()
          })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

function filterAsyncRouter(asyncRouterMap,pPath) {
  var accessedRouters=[];
  asyncRouterMap.filter(route => {
    if(route.children && route.children.length>0){
      var children= filterAsyncRouter(route.children,route.permissionUrl)
    }
    if (route.type == 1) {
      accessedRouters.push({ path: route.permissionUrl,component: Layout,meta:{title: route.permissionName},children:children })
    }else if(route.type == 2){
      accessedRouters.push({ path: route.permissionUrl,component: require('@/views'+route.permissionUrl+'/index').default,meta:{title: route.permissionName},children:children })
    }else if(route.type == 3){
      accessedRouters.push({ path: route.permissionUrl,name: route.permissionUrl,component: require('@/views'+route.permissionUrl+'.vue').default,meta:{title: route.permissionName},children:children,hidden:true })
    }
    return true
  })
  return accessedRouters
}