import request from '@/libs/api.request'
import { getToken } from '@/libs/util'
import sha1 from 'js-sha1'

let handlePassword = (password) => {
  return sha1(password + 'superpayment')
}

export const login = ({ userName, password, captcha, id }) => {
  const data = {
    account: userName,
    password: handlePassword(password),
    op: 1,
    captcha,
    id
  }
  return request({
    url: 'user/login',
    data,
    method: 'post'
  })
}

export const getUserInfo = () => {
  let token = getToken()
  return request({
    url: 'user/info',
    params: {
      auth: getToken()
    },
    data: {
      token
    },
    method: 'POST'
  })
}

export const updateUserBase = (name, password, newPassword, project) => {
  let token = getToken()
  return request({
    url: 'user/updateBase',
    params: {
      auth: token
    },
    data: {
      token, name, password: handlePassword(password), newPassword, project
    },
    method: 'POST'
  })
}

export const logout = (token) => {
  return request({
    url: 'user/logout',
    data: { token },
    params: {
      auth: getToken()
    },
    method: 'post'
  })
}

export const getUserList = ({ pageSize, curPageNum, status, name, account, userId, startTime, endTime, phone, powerLevel, project }) => {
  powerLevel = powerLevel && Number(powerLevel)
  return request({
    url: 'user/list',
    data: { pageSize, curPageNum, status, name, account, userId, startTime, endTime, phoneNum: phone, powerLevel, project },
    params: {
      auth: getToken()
    },
    method: 'post'
  })
}
export const getUserCount = ({ status, name, account, userId, startTime, endTime, phone, powerLevel, project }) => {
  powerLevel = powerLevel && Number(powerLevel)

  return request({
    url: 'user/count',
    data: { status, name, account, userId, startTime, endTime, phoneNum: phone, powerLevel, project },
    params: {
      auth: getToken()
    },
    method: 'post'
  })
}

export const prohibitUser = (userId, status) => {
  return request({
    url: 'user/prohibit',
    data: { userId, status },
    params: {
      auth: getToken()
    },
    method: 'post'
  })
}

export const addUser = (userInfo) => {
  userInfo.password = handlePassword(userInfo.password)
  userInfo.phoneNum = userInfo.phone || userInfo.phoneNum
  return request({
    url: 'user/add',
    params: {
      auth: getToken()
    },
    data: userInfo,
    method: 'post'
  })
}

export const updateUser = (userInfo) => {
  if (userInfo.password) {
    userInfo.password = handlePassword(userInfo.password)
  }
  userInfo.phoneNum = userInfo.phone || userInfo.phoneNum
  return request({
    url: 'user/update',
    params: {
      auth: getToken()
    },
    data: userInfo,
    method: 'post'
  })
}

export const deleteUser = (userId) => {
  return request({
    url: 'user/delete',
    params: {
      auth: getToken()
    },
    data: { userId },
    method: 'post'
  })
}

export const addRole = (args) => {
  return request({
    url: 'user/addRole',
    params: {
      auth: getToken()
    },
    data: args,
    method: 'post'
  })
}

export const deleteRole = (args) => {
  return request({
    url: 'user/deleteRole',
    params: {
      auth: getToken()
    },
    data: args,
    method: 'post'
  })
}
export const getRoleInfo = (userId) => {
  return request({
    url: 'user/roleInfo',
    params: {
      auth: getToken()
    },
    data: { userId },
    method: 'post'
  })
}

/// //////////////////////////////////////////////////////////////////////////////

export const getUnreadCount = () => {
  // return request({
  //   url: 'message/count',
  //   method: 'get'
  // })
  return new Promise((resolve, reject) => {
    resolve(0)
  })
}

export const getMessage = () => {
  return request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
