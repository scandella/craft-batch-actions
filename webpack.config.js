const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: {
    bars: path.resolve(__dirname, 'src/assets/bars/src/scripts/main.ts')
  },
  output: {
    path: path.resolve(__dirname, 'src/assets'),
    filename: '[name]/dist/scripts/[name].js'
  },
  externals: {
    jquery: 'jQuery',
    craft: 'Craft',
    garnish: 'Garnish'
  },
  resolve: {
    extensions: ['.ts', '.tsx']
  },
  module: {
    rules: [
      {
        use: ['ts-loader'],
        include: [path.resolve(__dirname, 'src')],
        test: /\.tsx?$/
      },
      {
        use: ['source-map-loader'],
        enforce: 'pre',
        test: /\.js$/
      },
      {
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        test: /\.css$/
      },
      {
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        test: /\.scss$/
      }
    ]
  },
  devtool: 'source-map',
  plugins: [new MiniCssExtractPlugin({
    filename: '[name]/dist/styles/[name].css'
  })]
}
