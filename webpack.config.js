var path = require('path')

module.exports = {
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
    filename: 'image-scanner.js',
    path: path.resolve(__dirname, 'dist')
  },
  cache: {
    type: 'memory'
  },
  watchOptions: {
    poll: true,
  },
  experiments: {
    asyncWebAssembly: true
  }
}
