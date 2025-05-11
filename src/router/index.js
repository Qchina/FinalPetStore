import { createRouter, createWebHistory } from 'vue-router'  

const routes = [
  // ...其他路由...
  {
    path: '/',
    redirect: '/commodity'  // 确保有默认重定向
  },
  {
    path: '/userauth',
    component: () => import('../views/UserAuth.vue')  // 使用动态导入
  },
  {
    path: '/accountauth',
    component: () => import('../views/AccountAuth.vue')  // 使用动态导入
  }, {
    path: '/cart',
    component:()=>import('../views/CartAuth.vue')
  }, {
    path: '/order1',
    component:()=>import('../views/PaymentDetails.vue')
  }, {
    path: '/order2',
    component:()=>import('../views/ConfirmOrder.vue')
  }, {
    path: '/order3',
    component:()=>import('../views/OrderDetails.vue')
  },
  {
    path: '/commodity/:category?',
    name: 'CommodityView',
    component: () => import('../views/commodity/CommodityView.vue')
  },
  // 修改 ProductDetail 路由，确保它嵌套在正确的布局中
  {
    path: '/commodity/:categoryId/product/:productId',
    name: 'ProductDetail',
    component: () => import('../views/commodity/CommodityView.vue'),
    props: route => ({
      categoryId: route.params.categoryId,
      productId: route.params.productId,
      view: 'product'
    })
  },
  // 修改 ItemDetail 路由，确保它嵌套在正确的布局中
  {
    path: '/commodity/:categoryId/product/:productId/item/:itemId',
    name: 'ItemDetail',
    component: () => import('../views/commodity/CommodityView.vue'),
    props: route => ({
      categoryId: route.params.categoryId,
      productId: route.params.productId,
      itemId: route.params.itemId,
      view: 'item'
    })
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router