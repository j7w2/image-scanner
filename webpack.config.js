var path = require('path')
var I18nPlugin = require("@zainulbr/i18n-webpack-plugin");

var languages = {
  "en": null,
  "ja": require("./src/locale/ja.json")
};
module.exports = Object.keys(languages).map(function(language) {
  return {
    name: language,
    entry: {
      "index": './src/index.ts',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.wasm', '.hash']
    },
    module: {
      rules: [
        { test: /\.ts$/, loader: 'ts-loader' },
        {
          test: /hash$/i,
          use: 'raw-loader',
        },
      ],
    },
    output: {
      filename: 'image-scanner.' + language + '.js',
      path: path.resolve(__dirname, 'dist')
    },
    cache: {
      type: 'memory'
    },
    watchOptions: {
      poll: true,
    },
    plugins: [
			new I18nPlugin(
				languages[language]
			)
		],
    experiments: {
      asyncWebAssembly: true
    }
  }
})
