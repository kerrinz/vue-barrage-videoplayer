const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
let publicPath = process.env.NODE_ENV === 'prodution' ? '/' : './';
module.exports = {
  // 基本路径
  publicPath: publicPath,
  assetsDir: 'assets',
  // 输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
  },
  devServer: {
/*
    overlay: {
      warnings: true,
      errors: true
    },
*/
    port: 8080,
    proxy: {
      '/': {
        target: 'https://recomi.site',
        secure: true,
        ws: false,
        changeOrigin: true
        // ,
        // pathRewrite: {
        //   '^/api': '/'
        // }
      }
    },
  },
}
