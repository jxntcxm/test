import Main from '@/components/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/power',
    name: 'power',
    meta: {
      icon: 'md-build',
      title: '权限管理'
    },
    component: Main,
    children: [
      // {
      //   path: 'power_page',
      //   name: 'power_page',
      //   meta: {
      //     icon: 'ios-color-wand',
      //     title: '权限配置'
      //   },
      //   component: () => import('@/view/power/power-page.vue')
      // },
      {
        path: 'role_page',
        name: 'role_page',
        meta: {
          icon: 'ios-color-wand-outline',
          title: '角色配置'
        },
        component: () => import('@/view/power/role-page.vue')
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      icon: 'ios-build-outline',
      title: '用户管理'
    },
    component: Main,
    children: [
      {
        path: 'user_page',
        name: 'user_page',
        meta: {
          icon: 'ios-build-outline',
          title: '用户管理'
        },
        component: () => import('@/view/user/user-page.vue')
      },
      {
        path: 'session_page',
        name: 'session_page',
        meta: {
          icon: 'ios-build-outline',
          title: 'Session管理'
        },
        component: () => import('@/view/user/session-page.vue')
      }
    ]
  },
  {
    path: '/app',
    name: 'app',
    meta: {
      icon: 'md-build',
      title: '微服务管理'
    },
    component: Main,
    children: [
      {
        path: 'app_page',
        name: 'app_page',
        meta: {
          icon: 'md-build',
          title: '微服务管理'
        },
        component: () => import('@/view/app/app-page.vue')
      },
      {
        path: 'app_open_page',
        name: 'app_open_page',
        meta: {
          icon: 'md-build',
          title: '权限等级查看'
        },
        component: () => import('@/view/app/app-open-page.vue')
      }
    ]
  },
  {
    path: '/platform',
    name: 'platform',
    meta: {
      icon: 'md-build',
      title: '项目管理'
    },
    component: Main,
    children: [
      {
        path: 'platform_page',
        name: 'platform_page',
        meta: {
          icon: 'md-build',
          title: '项目管理'
        },
        component: () => import('@/view/platform/platform-page.vue')
      },
      {
        path: 'base_power',
        name: 'base_power',
        meta: {
          icon: 'md-build',
          title: '基础UI'
        },
        component: () => import('@/view/platform/base-power.vue')
      }
    ]
  },
  {
    path: '/project',
    name: 'project',
    meta: {
      icon: 'md-build',
      title: '平台管理'
    },
    component: Main,
    children: [
      {
        path: 'project_page',
        name: 'project_page',
        meta: {
          icon: 'md-build',
          title: '平台管理'
        },
        component: () => import('@/view/project/project-page.vue')
      }

    ]
  },
  {
    path: '/record',
    name: 'record',
    meta: {
      icon: 'ios-infinite',
      title: '审计'
    },
    component: Main,
    children: [
      {
        path: 'record_page',
        name: 'record_page',
        meta: {
          icon: 'ios-infinite',
          title: '操作日志'
        },
        component: () => import('@/view/record/record-page.vue')
      },
      {
        path: 'auth_fail_page',
        name: 'auth_fail_page',
        meta: {
          icon: 'ios-infinite',
          title: '鉴权失败日志'
        },
        component: () => import('@/view/record/auth-fail-page.vue')
      },
      {
        path: 'backup',
        name: 'backup',
        meta: {
          icon: 'ios-infinite',
          title: '数据简单导出'
        },
        component: () => import('@/view/record/backup.vue')
      }
    ]
  },
  {
    path: '/test',
    name: 'test',
    meta: {
      icon: 'md-bug',
      title: '接口测试'
    },
    component: Main,
    children: [
      {
        path: 'api',
        name: 'api',
        meta: {
          icon: 'md-bug',
          title: '接口测试'
        },
        component: () => import('@/view/test/api.vue')
      }
    ]
  },
  {
    path: '/config',
    name: 'config',
    meta: {
      icon: 'md-bug',
      title: '配置'
    },
    component: Main,
    children: [
      {
        path: 'main',
        name: 'main',
        meta: {
          icon: 'md-bug',
          title: '配置'
        },
        component: () => import('@/view/config/main.vue')
      }
    ]
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/modifyInfo',
    name: 'modifyInfo',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {

        path: 'modify-info',
        name: 'modify-info',
        meta: {
          icon: 'md-notifications',
          title: '修改信息'
        },
        component: () => import('@/view/single-page/modify-info.vue')
      }
    ]
  },
  {
    path: '/message',
    name: 'message',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {

        path: 'message_page',
        name: 'message_page',
        meta: {
          icon: 'md-notifications',
          title: '消息中心'
        },
        component: () => import('@/view/single-page/message/index.vue')
      }
    ]
  },

  // {
  //   path: '/update',
  //   name: 'update',
  //   meta: {
  //     icon: 'md-cloud-upload',
  //     title: '数据上传'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'update_table_page',
  //       name: 'update_table_page',
  //       meta: {
  //         icon: 'ios-document',
  //         title: '上传Csv'
  //       },
  //       component: () => import('@/view/update/update-table.vue')
  //     },
  //     {
  //       path: 'update_paste_page',
  //       name: 'update_paste_page',
  //       meta: {
  //         icon: 'md-clipboard',
  //         title: '粘贴表格数据'
  //       },
  //       component: () => import('@/view/update/update-paste.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/excel',
  //   name: 'excel',
  //   meta: {
  //     icon: 'ios-stats',
  //     title: 'EXCEL导入导出'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'upload-excel',
  //       name: 'upload-excel',
  //       meta: {
  //         icon: 'md-add',
  //         title: '导入EXCEL'
  //       },
  //       component: () => import('@/view/excel/upload-excel.vue')
  //     },
  //     {
  //       path: 'export-excel',
  //       name: 'export-excel',
  //       meta: {
  //         icon: 'md-download',
  //         title: '导出EXCEL'
  //       },
  //       component: () => import('@/view/excel/export-excel.vue')
  //     }
  //   ]
  // },

  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
