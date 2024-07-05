// vue.config.js
export function chainWebpack(config) {
  config.module
    .rule('vue')
    .use('vue-loader')
    .loader('vue-loader')
    .tap((options) => {
      return options;
    });

  config.module
    .rule('js')
    .use('babel-loader')
    .loader('babel-loader')
    .tap((options) => {
      return options;
    });
}
