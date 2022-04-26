module.exports = {
    productionSourceMap: false,
    lintOnSave: false,
    devServer: {       
        proxy: {
            '/': {
                ws: false,
                target: 'http://3.1.171.240:40001/api',
                changeOrigin: true,
                pathRewrite: {
                    '^/': '/'
                }
            }
        }
    }
}
