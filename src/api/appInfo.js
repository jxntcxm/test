import request from '@/libs/api.request'
import { getToken } from '@/libs/util'

export const getAppInfo = (key) => {
  return request({
    url: 'app/info',
    params: {
      auth: getToken()
    },
    data: { key },
    method: 'POST'
  })
}
export const deleteAPITree = ({ key, fatherLine }) => {
  return request({
    url: 'app/deleteAPITree',
    params: {
      auth: getToken()
    },
    data: { key, fatherLine },
    method: 'POST'
  })
}
export const addAPITree = ({ key, path, fatherLine, name, method, isMenu, powerLevel }) => {
  return request({
    url: 'app/addAPITree',
    params: {
      auth: getToken()
    },
    data: { key, path, fatherLine, name, method, isMenu, powerLevel },
    method: 'POST'
  })
}
export const updateAPITree = ({ key, path, fatherLine, name, method, isMenu, powerLevel }) => {
  return request({
    url: 'app/updateAPITree',
    params: {
      auth: getToken()
    },
    data: { key, path, fatherLine, name, method, isMenu, powerLevel },
    method: 'POST'
  })
}

export const getAppList = ({ pageSize, curPageNum, status, name, key, allowAll, project, appDomain }) => {
  return request({
    url: 'app/list',
    data: { pageSize, curPageNum, status, name, key, allowAll, project, appDomain },
    params: {
      auth: getToken()
    },
    method: 'post'
  })
}

export const getAppListPrimary = () => {
  return request({
    url: 'app/list',
    data: { primary: true },
    params: {
      auth: getToken()
    },
    method: 'post'
  })
}
export const getAppCount = ({ status, name, key, allowAll, project, appDomain }) => {
  return request({
    url: 'app/count',
    data: { status, name, key, allowAll, project, appDomain },
    params: {
      auth: getToken()
    },
    method: 'post'
  })
}

export const prohibitApp = (key, status) => {
  return request({
    url: 'app/prohibit',
    data: { key, status },
    params: {
      auth: getToken()
    },
    method: 'post'
  })
}

export const addApp = (appInfo) => {
  return request({
    url: 'app/add',
    params: {
      auth: getToken()
    },
    data: appInfo,
    method: 'post'
  })
}

export const updateApp = (appInfo) => {
  return request({
    url: 'app/update',
    params: {
      auth: getToken()
    },
    data: appInfo,
    method: 'post'
  })
}

export const deleteApp = (key) => {
  return request({
    url: 'app/delete',
    params: {
      auth: getToken()
    },
    data: { key },
    method: 'post'
  })
}

// 查看密钥
export const getSecret = (key) => {
  return request({
    url: 'app/getSecret',
    params: {
      auth: getToken()
    },
    data: { key },
    method: 'POST'
  })
}
// 重置密钥
export const resetSecret = (key) => {
  return request({
    url: 'app/resetSecret',
    params: {
      auth: getToken()
    },
    data: { key },
    method: 'POST'
  })
}

// 设置API是否公开
export const setAPIOpen = (key, fatherLine, powerLevel) => {
  return request({
    url: 'app/setAPIOpen',
    params: {
      auth: getToken()
    },
    data: { key, fatherLine, powerLevel: powerLevel },
    method: 'POST'
  })
}
