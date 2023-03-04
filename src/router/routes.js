
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
    path: '/welcome',
    component: () => import('layouts/WelcomeLYT.vue'),
  },

  {
    path: '/cluster',
    component: () => import('layouts/ZentLYT.vue'),
    children: [
      { path: '', component: () => import('pages/Zent/Index.vue') }
    ]
  },

  {
    path: '/multimedia',
    component: () => import('layouts/VmediaLYT.vue'),
    children: [
      { path: '', component: () => import('pages/VMedia/Index.vue') },
      { path: 'product', component: () => import('pages/VMedia/Product.vue') },
      { path: 'channel', component: () => import('pages/VMedia/Channel.vue') },
      { path: 'radio', component: () => import('pages/VMedia/Radio.vue') },
    ]
  },

  {
    path: '/profile',
    component: () => import('layouts/ProfileLYT.vue'),
    // children: [
    //   { path: '', component: () => import('pages/Zent/Index.vue') }
    // ]
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
          { path:'resurtido/:rid', component: () => import('pages/Store/Warehouses/RestockOrder.vue') },
          { path:'ubicador', component: () => import('pages/Apps/Locator.vue') },
          {
            path: ':wid',
            children:[
              {
                path:'', name:'wrh', component: () => import('pages/Store/Warehouses/Warehouse.vue'),
                children:[
                  { path: 'inicio', name:'wrhresume', component: () => import('src/pages/Store/Warehouses/Resume.vue') },
                  { path: 'productos', name:'wrhproducts', component: () => import('pages/Store/Warehouses/Products.vue') },
                  { path: 'estructura', name:'wrhstructure', component: () => import('pages/Store/Warehouses/Structure.vue') },
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
