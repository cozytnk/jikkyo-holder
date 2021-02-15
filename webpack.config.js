const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin') // vue2
// const { VueLoaderPlugin } = require('vue-loader') // vue3

module.exports = {
  // mode: 'development', // NOTE: unsafe-eval
  mode: 'production',
  entry : `${__dirname}/src/popup.js`,
  output : {
    filename: 'bundle.js',
    path: `${__dirname}/dist`,
  },
  module: {
    rules: [
      { test: /\.vue$/, loader: 'vue-loader' },
      { test: /\.css$/, use: [ 'vue-style-loader', 'style-loader', 'css-loader' ] },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    // new webpack.DefinePlugin({
    //   __VUE_OPTIONS_API__: true,
    //   __VUE_PROD_DEVTOOLS__: false
    // }), // vue3
  ],
  resolve: {
    // extensions: ['.vue', '.js'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    },
  },
}



/**

    // "@vue/compiler-sfc": "^3.0.5",
    "css-loader": "^5.0.2",
    "style-loader": "^2.0.0",
    "vue": "^3.0.5",
    "vue-loader": "^16.1.2",
    "vue-style-loader": "^4.1.2",
    "vue-template-compiler": "^2.6.12",
    "webpack": "^5.21.2",
    "webpack-cli": "^4.5.0"
 */