// vue.config.js
export function chainWebpack(config) {
  config.module
    .rule('vue')
    .use('vue-loader')
    .loader('vue-loader')
    .tap((options) => {
      // modify the options...
      return options;
    });

  config.module
    .rule('js')
    .use('babel-loader')
    .loader('babel-loader')
    .tap((options) => {
      // modify the options...
      return options;
    });
}
