import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import { Message } from 'element-ui'
import store from '@/store'
import router from '../router/index'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: 'http://39.106.98.246/api/v1',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // console.log(res)

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // to re-login
      //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
      //     confirmButtonText: 'Re-Login',
      //     cancelButtonText: 'Cancel',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      // console.log('code401', res)
      return res
    }
  },
  error => {
    if (error.response.status === 401) {
      // console.log('请求过期或者出错', error.response.data)
      Message({
        message: '用户签名过期，请退出重新登录！',
        type: 'error',
        duration: 5 * 1000
      })
      // localStorage.removeItem('token')
      router.replace({
        path: '/login' // 到登录页重新获取token
      })
    } else {
      const message = error.response.data.msg === undefined && error.response.data.msg == null ? error.message : error.response.data.msg
      Message({
        message: message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
    return Promise.reject(error)
  }
)

export default service
