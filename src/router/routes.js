
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
      {
        path: 'almacenes',
        children:[
          { path:'', name:'wrhs', component: () => import('pages/Store/Warehouses/Index.vue') },
          { path:'pedidos', component: () => import('pages/Store/Warehouses/Orders.vue') },
          { path:'resurtido', component: () => import('pages/Store/Warehouses/Restock.vue') },
          {
            path: ':wid',
            children:[
              {
                path:'', name:'wrh', component: () => import('pages/Store/Warehouses/Warehouse.vue'),
                children:[
                  { path: 'estructura', name:'wrhstructure', component: () => import('pages/Store/Warehouses/Structure.vue') },
                  { path: 'productos', name:'wrhproducts', component: () => import('pages/Store/Warehouses/Products.vue') },
                  { path: 'resumen', name:'wrhresume', component: () => import('src/pages/Store/Warehouses/Resume.vue') },
                  {
                    path:'seccion/:lid', name:'wrhloc', component: () => import('pages/Store/WrhsLocation/Index.vue'),
                    children:[
                      { path: 'estructura', name:'wrhlocstructure', component: () => import('pages/Store/WrhsLocation/Structure.vue') },
                      { path: 'productos', name:'wrhlocproducts', component: () => import('pages/Store/WrhsLocation/Products.vue') },
                      { path: 'resumen', name:'wrhlocresume', component: () => import('src/pages/Store/WrhsLocation/Resume.vue') }
                    ]
                  }
                ]
              },
            ]
          }
        ],
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
