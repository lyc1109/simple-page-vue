/**
 * 构建工具辅助类
 */
let path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

/**
 * 导出静态资源输出路径
 *
 * @param _path 父级路径
 * @returns 输出目录绝对路径
 */
exports.assetsPath = function (_path) {
  return path.posix.join("static", _path)
};

/**
 * 导出css相关loader
 *
 * @param options 属性配置
 * @returns 返回css的loader，如sass\less\css等
 */
exports.cssLoaders = function (options) {
  options = options || {};

  // css loader 配置定义
  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  };

  // 通过提取文本插件生成loader
  function generateLoaders(loader, loaderOptions) {
    let loaders = [cssLoader];
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // 提取CSS到独立文件中（仅生产环境时生效）
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', {indentedSyntax: true}),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
};

/**
 * 为独立的css文件（在vue文件外面的）生成loader
 *
 * @param options 配置
 * @returns {Array}
 */
exports.styleLoaders = function (options) {
  let output = [];
  let loaders = exports.cssLoaders(options);
  for (let extension in loaders) {
    let loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output;
};
