
const routes = [
  { path: '/', redirect: '/login' },

  {
    path: '/login',
    component: () => import('layouts/AuthLYT.vue'),
    children: [
      { path: '', component: () => import('pages/Auth/Index.vue') }
    ]
  },

  {
    path: '/passconfig',
    component: () => import('layouts/SetPassLYT.vue'),
  },

  {
    path: '/zent',
    component: () => import('layouts/ZentLYT.vue'),
    children: [
      { path: '', component: () => import('pages/Zent/Index.vue') }
    ]
  },

  {
    path: '/store/:idstore',
    component: () => import('layouts/StoreLYT.vue'),
    children: [
      { path: '', component: () => import('pages/Store/Index.vue') },
      { path: 'usuarios', component: () => import('pages/Store/Users/Index.vue') },
      { path: 'almacenes', component: () => import('pages/Store/Warehouses/Index.vue') },
      { path: 'almacenes/pedidos', component: () => import('pages/Store/Warehouses/Orders.vue') },
      { path: 'almacenes/resurtido', component: () => import('pages/Store/Warehouses/Restock.vue') },
      { path: 'almacenes/resurtido/ajustes', component: () => import('pages/Store/Warehouses/RestockConfig.vue') },
      {
        path: 'almacenes/:wid', component: () => import('pages/Store/Warehouses/Warehouse.vue'),
        children:[
          { path: 'estructura', component: () => import('pages/Store/Warehouses/Structure.vue') },
          { path: 'productos', component: () => import('pages/Store/Warehouses/Products.vue') },
          { path: 'resumen', component: () => import('src/pages/Store/Warehouses/Resume.vue') }
        ]
      },
      {
        path: 'almacenes/:wid/seccion/:lid', component: () => import('pages/Store/WrhsLocation/Index.vue'),
        children:[
          { path: 'estructura', component: () => import('pages/Store/WrhsLocation/Structure.vue') },
          { path: 'productos', component: () => import('pages/Store/WrhsLocation/Products.vue') },
          { path: 'resumen', component: () => import('src/pages/Store/WrhsLocation/Resume.vue') }
        ]
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
