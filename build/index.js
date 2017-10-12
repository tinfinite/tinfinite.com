var fs = require('fs')
var path = require('path')
var uploadFile = require('./uploadFile')
var async = require('asyncawait/async')

var distPath = path.resolve(__dirname, '../.nuxt/dist/')
let result = []

const getStatics = function (dirPath) {
  let files = fs.readdirSync(dirPath)
  files.forEach(function (file) {
    //拼接为绝对路径
    let subPath = path.resolve(dirPath, file)
    //拿到文件信息对象
    let stats = fs.statSync(subPath)
    //判断是否为文件夹类型
    if (stats.isDirectory()) {
      //递归读取文件夹
      getStatics(subPath)
    } else if (file.indexOf('.') > 0 && file.indexOf('.map') < 0) {
      result.push({
        name: subPath.split('dist/')[1],
        path: subPath
      })
    }
  })
}

async(function () {
  getStatics(distPath)
  uploadFile.mutilUpload(result, function (res) {
    console.log('-> 上传完毕...')
    for (let i in res) {
      console.log(res[i])
    }
  })
})()
