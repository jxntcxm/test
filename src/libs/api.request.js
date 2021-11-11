import axios from 'axios'
import config from '@/config'
import store from '@/store'
import { Message } from 'iview'
import { getToken } from '@/libs/util'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

const service = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    let token = getToken()
    if (token) {
      config.headers['Token'] = token
    }
    config.headers['Request-Source'] = '7'
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    console.log('err' + error) // for debug
    if (error.response && error.response.data.errcode === '-9999') {
      Message.error({
        content: 'token过期，请重新登陆',
        duration: 3
      })
      store.dispatch('handleLogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    } else if (error.message.indexOf('timeout of 5000ms exceeded') !== -1) {
      Message.error({
        content: '登陆超时',
        duration: 3
      })
      return Promise.reject(error)
    } else if (error.response && error.response.data && error.response.data.errmsg) {
      Message.error({
        content: error.response.data.errmsg,
        duration: 3
      })
      return Promise.reject(error)
    } else {
      Message.error({
        content: error.message,
        duration: 3
      })
      return Promise.reject(error)
    }
  }
)

export default service
