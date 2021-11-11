import request from '@/libs/api.request'
import { getToken } from '@/libs/util'

// 获取到角色数组
export const getRoleList = ({ pageSize, curPageNum, status, name, appKey, roleIdArray, isBase, space, tag, project, extInfoSearch }) => {
  return request({
    url: 'role/list',
    data: { pageSize, curPageNum, status, name, appKey, roleIdArray, isBase, space, tag, project, extInfoSearch },
    params: {
      auth: getToken()
    },
    method: 'POST'
  })
}

// 获取到角色数组, 只包含ID， name, appKey这些属性
export const getRoleListPrimary = ({ project }) => {
  return request({
    url: 'role/list',
    data: { primary: true, project },
    params: {
      auth: getToken()
    },
    method: 'POST'
  })
}

// 获取到角色数量
export const getRoleCount = ({ status, name, appKey, isBase, space, tag, project, extInfoSearch }) => {
  return request({
    url: 'role/count',
    data: { status, name, appKey, isBase, space, tag, project, extInfoSearch },
    params: {
      auth: getToken()
    },
    method: 'POST'
  })
}

// 添加一个角色
export const addRole = ({ name, appKey, apiTreeIdArray, uiPower, status, isBase, space, tag, project, extInfo }) => {
  return request({
    url: 'role/add',
    data: { name, appKey, apiTreeIdArray, uiPower, status, isBase, space, tag, project, extInfo },
    params: {
      auth: getToken()
    },
    method: 'POST'
  })
}

// 更新一个角色
export const updateRole = ({ id, name, appKey, apiTreeIdArray, uiPower, status, isBase, space, tag, project, extInfo }) => {
  return request({
    url: 'role/update',
    data: { id, name, appKey, apiTreeIdArray, uiPower, status, isBase, space, tag, project, extInfo },
    params: {
      auth: getToken()
    },
    method: 'POST'
  })
}

// 删除一个角色
export const deleteRoleArray = (roleIdArray) => {
  return request({
    url: 'role/delete',
    data: { roleIdArray },
    params: {
      auth: getToken()
    },
    method: 'POST'
  })
}
// 禁用解禁一个角色
export const prohibitRole = (id, status) => {
  return request({
    url: 'role/prohibit',
    data: { id, status },
    params: {
      auth: getToken()
    },
    method: 'POST'
  })
}
// 基础一个角色
export const basicRole = (id, isBase) => {
  return request({
    url: 'role/basic',
    data: { id, isBase },
    params: {
      auth: getToken()
    },
    method: 'POST'
  })
}

/// ///////////////////////////////////////

export const errorReq = () => {
  return request({
    url: 'error_url',
    params: {
      auth: getToken()
    },
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return request({
    url: 'save_error_logger',
    data: info,
    params: {
      auth: getToken()
    },
    method: 'post'
  })
}
