module.exports = {
  transpileDependencies: ['vuetify'],

  devServer: {
    proxy: {
      '/api': {
        target: 'http://138.201.175.168:8080',
        pathRewrite: { '^/api': '' }
      }
    }
  }
}
