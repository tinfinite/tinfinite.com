import axios from 'axios'
import _interopDefault from '~assets/utils/_interopDefault'

const Request = {
  all (params) {
    const methods = []
    params.requests && params.requests.forEach((request) => {
      const req = request.method === 'post' ? this.asyncPost(request) : this.asyncGet(request)
      methods.push(req)
    })

    const response = axios.all(methods)

    return response.then(axios.spread(params.done)).catch((err = 'can not catch error!') => {
      this._failCallback(err, params)
    })
  },

  get (params) {
    const response = this._get(params)

    return response.then((res) => {
      const { data } = res
      return params.done && params.done(data)
    }).catch((err = 'can not catch error!') => {
      this._failCallback(err, params)
    })
  },

  post (params) {
    const response = this._post(params)

    return response.then((res) => {
      const { data } = res
      return params.done && params.done(data)
    }).catch((err = 'can not catch error!') => {
      this._failCallback(err, params)
    })
  },

  asyncGet (params) {
    const response = this._get(params)

    response.then((res) => {
      const { data } = res
      params.done && params.done(data)
    }).catch((err = 'can not catch error!') => {
      this._failCallback(err, params)
    })

    return response
  },

  asyncPost (params) {
    const response = this._post(params)

    response.then((res) => {
      const { data } = res
      return params.done && params.done(data)
    }).catch((err = 'can not catch error!') => {
      this._failCallback(err, params)
    })

    return response
  },

  _get (params) {
    return this._checkParams(params)._request({
      url: params.url,
      method: 'get',
      params: params.data,
      header: params.header,
      baseURL: getBaseUri(),
      context: params.context
    })
  },

  _post (params) {
    return this._checkParams(params)._request({
      url: params.url,
      method: 'post',
      data: params.data,
      header: params.header,
      baseURL: getBaseUri()
    })
  },

  _request ({ url, method, params = {}, data = {}, baseURL, header = {}, context = {} }) {
    const headers = this._getHeaders(header, context)

    return axios.request({
      url,
      method,
      baseURL,
      headers,
      params,
      data
    })
  },

  _checkParams (params) {
    if (!params || !params.url) {
      throw new Error('request\'url is missed!')
    }

    return this
  },

  _getHeaders (header, context) {
    let headers = {}
    let Cookie = null
    let userToken = ''
    if (context.req) {
      Cookie = context.req.headers && str2json(context.req.headers.cookie)
      userToken = Cookie['_tkutoken'] || ''
    } else {
      Cookie = _interopDefault(require('fe-utils/cookie'))
      userToken = Cookie.getCookie('_tkutoken')
    }

    if (userToken) {
      headers['x-user-token'] = userToken
    }

    if (header) {
      for (let key in header) {
        headers[key] = header[key]
      }
    }

    return headers
  },

  _failCallback (err, {fail, context = null}) {
    let res = err.response
    let error = res ? { statusCode: res.status, message: [401, 500].indexOf(res.status) ? res.data.err : res.statusText } : err
    res && console.log(error)
    if (res && res.status === 401 && context) {
      this._loginExpired(context)
    }
    context && context.error(error)
  },

  _loginExpired (context) {
    let req = context.req
    let host = req.headers.host
    let originalUrl = req.originalUrl
    context.redirect(`/login?forcedAuthenticated=true&redirect_uri=https://${host + originalUrl}`)
  },

  _generateUrl (url) {
    return getBaseUri() + url
  }
}

export default Request

function getBaseUri () {
  const area = process.env.NODE_SP === 'huabei2' ? 'huabei2-' : ''
  const env = process.env.BUILD_ENV === 'test' ? '-dev' : process.env.BUILD_ENV === 'stage' ? '-stg' : ''

  return `https://${area}live${env}.tinfinite.com/api/`
}

function str2json (str) {
  var arr = str && str.split('; ') || []
  var json = {}
  for (var i = 0; i < arr.length; i++) {
    var arr2 = arr[i].split('=')
    json[arr2[0]] = arr2[1]
  }
  return json
}
