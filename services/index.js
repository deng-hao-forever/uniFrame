import base from 'utils/host'

const baseOptions = (params, method = 'GET') => {
  let { url, data } = params // data包含4项内容，data-参数，header-请求头，succes-成功的回调，fail-失败的回调
  let defaultHeader = { version: 'v1' }
  let token = uni.getStorageSync('token')
  defaultHeader.token = token
  const options = {
    url: base + url,
    data: data.data,
    method: method,
    header: data.header
      ? Object.assign(defaultHeader, data.header)
      : defaultHeader,
    complete: () => {
      if (data.complete) {
        data.complete()
      }
    },
    success: res => {
      console.log(res)
      if (res.data.code === 200) {
        if (data.success) {
          data.success(res.data)
        }
      } else if (res.data.code === 406) {
        uni.clearStorageSync()
        uni.reLaunch({
          url: '/pages/login/index'
        })
      } else {
        uni.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    },
    fail: error => {
      uni.showToast({
        title: '系统错误，请稍后重试',
        icon: 'none',
        duration: 2000
      })
      console.log(error)
    }
  }
  return uni.request(options)
}

const api = {
  get(url, data) {
    let params = { url, data }
    return baseOptions(params)
  },
  post(url, data) {
    let params = { url, data }
    return baseOptions(params, 'POST')
  },
  put(url, data) {
    let params = { url, data }
    return baseOptions(params, 'PUT')
  },
  delete(url, data) {
    let params = { url, data }
    return baseOptions(params, 'DELETE')
  }
}

export default api
