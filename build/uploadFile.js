var qiniu = require('qiniu')
var path = require('path')

// 需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = 'Dp8kASWpn7U3ZZnJj_imYlDYwInr4FB-ELlZmG_q'
qiniu.conf.SECRET_KEY = 'oeuSU99ZIS15fy8AI6tZzKKdBIOxiF6QhywhKHO5'

const uploadFile = {
  pipeline: 'voicemessage',
  origin: 'ofe0v4nhm.qnssl.com',
  prefix: 'https://ofe0v4nhm.qnssl.com',
  bucket: 'liveshow', // 要上传的空间

  // 构建上传策略函数
  _uptoken: function (key) {
    var scope = this.bucket + ':' + key
    var putPolicy = new qiniu.rs.PutPolicy(scope)
    return putPolicy.token()
  },

  //构造上传函数
  _uploadFile: function (uptoken, key, localFile, callback) {
    var extra = new qiniu.io.PutExtra()
    qiniu.io.putFile(uptoken, key, localFile, extra, function (err, ret) {
      if(!err) {
        callback(ret)
      } else {
        console.log(err)
      }
    })
  },

  _makeKeys: function (filesInfo) {
    var result = []
    for (var i = 0, len = filesInfo.length; i < len; i++) {
      var item = filesInfo[i]
      var match = item.path.match(/\w+\.(\w+)$/)

      if (match) {
        result.push({
          name: item.name,
          path: item.path,
          key: item.name
        })
      } else {
        console.log('文件不能没有后缀名!')
      }
    }
    return result
  },

  upload: function (key, filePath, callback) {
    var token = this._uptoken(key)
    this._uploadFile(token, key, filePath, callback)
  },

  mutilUpload: function (filesInfo, callback) {
    var that = this
    var results = {}

    var files = this._makeKeys(filesInfo)
    files.forEach(function (item, index) {
      that.upload(item.key, item.path, function (ret) {
        results[item.name] = that.prefix + '/' + item.key
        Object.keys(results).length === files.length && callback && callback(results)
      })
    })
  }
}

module.exports = uploadFile
