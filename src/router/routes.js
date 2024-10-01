
const routes = [
  { path: '/', redirect: '/login' },

  {
    path: '/login',
    component: () => import('layouts/AuthLYT.vue'),
    children: [
      { path: '', component: () => import('pages/Auth/Login.vue') }
    ]
  },

  {
    path: '/welcome',
    component: () => import('layouts/WelcomeLYT.vue'),
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
    path: '/aa87',
    component: () => import('layouts/AA87_LYT.vue'),
  },

  {
    path: '/store/:idstore',
    component: () => import('layouts/StoreLYT.vue'),
    children: [
      { path: '', component: () => import('pages/Store/Index.vue') },
      {
        path: 'almacenes',
        children: [
          { path: '', name: 'wrhs', component: () => import('pages/Store/Warehouses/Index.vue') },
          {
            path: 'preventa',
            children: [
              { path:'', component: () => import('src/pages/Store/Warehouses/Orders.vue') },
              { path:':oid', component: () => import('src/pages/Store/Warehouses/Order.vue') }
            ]
          },
          {
            path: ':wid',
            children: [
              { path:'', name: 'wrh', component: () => import('pages/Store/Warehouses/Warehouse.vue') },
              { path: 'inicio', name: 'wrhresume', component: () => import('src/pages/Store/Warehouses/Resume.vue') },
            ]
            // children: [
            //   {
            //     children: [
            //       { path: 'inicio', name: 'wrhresume', component: () => import('src/pages/Store/Warehouses/Resume.vue') },
            //       { path: 'productos', name: 'wrhproducts', component: () => import('pages/Store/Warehouses/Products.vue') },
            //       { path: 'estructura', name: 'wrhstructure', component: () => import('pages/Store/Warehouses/Structure.vue') },
            //       {
            //         path: 'seccion/:lid', name: 'wrhloc', component: () => import('pages/Store/WrhsLocation/Index.vue'),
            //         children: [
            //           { path: 'estructura', name: 'wrhlocstructure', component: () => import('pages/Store/WrhsLocation/Structure.vue') },
            //           { path: 'productos', name: 'wrhlocproducts', component: () => import('pages/Store/WrhsLocation/Products.vue') },
            //           { path: 'resumen', name: 'wrhlocresume', component: () => import('src/pages/Store/WrhsLocation/Resume.vue') }
            //         ]
            //       }
            //     ]
            //   },
            // ]
          },
        ],
      },
      {
        path: 'resurtido',
        children: [
          { path:'', component: () => import('src/pages/Store/Warehouses/Restock/Index.vue') },
          { path:':roid', component: () => import('src/pages/Store/Warehouses/Restock/Order.vue') }
        ]
      },
      {
        path: 'preorders',
        children: [
          { path: '', name: 'pvt', component: () => import('pages/Store/Preorders/Index.vue')},
          { path:'config', name: 'cfg', component: () => import('pages/Store/Preorders/Config.vue') },
          { path:'pedidos', name: 'ped', component: () => import('pages/Store/Preorders/ListOrders.vue') },
          { path:'checkin', name: 'chckin', component: () => import('pages/Store/Preorders/Checkin.vue') },
          { path:'dashboard', name: 'dsh', component: () => import('pages/Store/Preorders/Dashboard.vue') },
          { path:'warehouse', name: 'wrhp', component: () => import('pages/Store/Preorders/Warehouse.vue') },
          { path:'pedidos/:oid', name: 'oid', component: () => import('pages/Store/Preorders/Order.vue') },
        ],
      },
      {
        path: 'sales',
        children: [
          { path: '', name: 'sles', component: () => import('pages/Store/Sale/Index.vue')},
          { path: 'cashdesks', name: 'cashR', component: () => import('pages/Store/Sale/CasherRegister.vue')},
        ],
      },
      {
        path: 'manpower',
        children: [
          { path: '', name: 'inx', component: () => import('pages/Store/RRHH/Index.vue')},
          { path: 'justifications', name: 'jst', component: () => import('pages/Store/RRHH/Justification.vue')},

        ],
      },
      {
        path: 'resp',
        children: [
          { path: 'form/:fid', name: 'sles', component: () => import('pages/Store/Forms/Responses.vue')},
        ],
      },
      { path: 'resurtido', component: () => import('pages/Store/Restock/Index.vue') },
    ]
  },

  {
    path: '/cluster',
    component: () => import('layouts/ClusterLYT.vue'),
    children: [
      { path: '', component: () => import('pages/Cluster/Index.vue') },
      {
        path: 'usuarios',
        children: [
          { path: '', name: 'users', component: () => import('pages/Cluster/Users/Index.vue') },
          { path: 'create', name: 'create_user', component: () => import('pages/Cluster/Users/Create.vue') },
          { path: 'branch', name: 'branches', component: () => import('pages/Cluster/Users/Branches.vue') },
          { path: 'positions', name: 'positions', component: () => import('pages/Cluster/Users/Positions.vue') },

        ]
      },
      {
        path: 'stores',
        children: [
          { path: '', name: 'stores', component: () => import('pages/Cluster/Stores/Index.vue') },
          { path: 'create', name: 'create_stores', component: () => import('pages/Cluster/Stores/Create.vue') },
        ]
      },
      {
        path: 'providers',
        children: [
          { path: '', name: 'providers', component: () => import('pages/Cluster/Providers/Index.vue') },
          { path: 'create', name: 'create_provider', component: () => import('pages/Cluster/Providers/Create.vue') },
        ]
      },

      {
        path: 'products',
        component: () => import('layouts/ProductLYT.vue'),
        children: [
          { path: '', name: 'products', component: () => import('pages/Cluster/Products/Index.vue') },
          { path: 'categories', name: 'categories', component: () => import('pages/Cluster/Products/Categories.vue') },
          { path: 'prices', name: 'prices', component: () => import('pages/Cluster/Products/Prices.vue') },
          { path: 'kits', name: 'kits', component: () => import('pages/Cluster/Products/Kits.vue') },
        ]
      },
      {
        path: 'manpower',
        component: () => import('layouts/RhLYT.vue'),
        children: [
          { path: '', name: 'rh', component: () => import('pages/Cluster/RRHH/Index.vue') },
          { path: 'create', name: 'create', component: () => import('pages/Cluster/RRHH/Create.vue') },
          { path: 'report', name: 'repot', component: () => import('pages/Cluster/RRHH/Report.vue') },
          { path: 'justification', name: 'justification', component: () => import('pages/Cluster/RRHH/Justification.vue') },

        ]
      },
      {
      path: 'indicators',
      component: () => import('layouts/indicatorLYT.vue'),
      children: [
        { path: '', name: 'rht', component: () => import('pages/Cluster/Indicator/Index.vue') },
        { path: 'forms', name: 'frm', component: () => import('pages/Cluster/Indicator/Forms.vue') },
        { path: 'forms/:fid', name: 'fid', component: () => import('pages/Cluster/Indicator/ViewForm.vue') },

      ]
    },
    ]
  },

  {
    path:'/apps',
    children:[
      {
        path:'transfers',
        component: () => import('src/layouts/Apps/TransfersLYT.vue'),
        children:[
          { path:'', name:'transfers_index', component: () => import('src/pages/Apps/Transfers/Index.vue') },
          { path:':tid', name:'transfers_basket', component: () => import('pages/Apps/Transfers/Transfer.vue') },
        ]
      },
      {
        path:'locator',
        component: () => import('src/layouts/Apps/LocatorLYT.vue'),
        children:[
          { path:'', name:'locator_index', component: () => import('src/pages/Apps/Locator/Index.vue') },
          // { path:'', name:'locator_index', component: () => import('src/pages/Apps/Locator/Index.vue') },
        ]
      }
    ]
  },

  {
    path: '/profile',
    component: () => import('layouts/ProfileLYT.vue'),
    children: [
      { path: '', component: () => import('pages/Profile/Index.vue') },
      { path: 'status', component: () => import('pages/Profile/Status.vue') },
      { path: 'changepass', component: () => import('pages/Profile/Cpass.vue') },
      { path: 'assist', component: () => import('pages/Profile/Assist.vue') },
      { path: 'sales', component: () => import('pages/Profile/Sales.vue') },
      { path: 'historywork', component: () => import('pages/Profile/History.vue') },

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
