const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const port= process.env["PORT"]||8080

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    port:port
  },
  entry: {
  main: './src/index.js',
  
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader"
      },
      {
        test: /\.(m4a|wav|mp3|gif|glb|png|jpe?g|svg|xml)$/i,
        use: "file-loader"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, "../")
    }),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
    /*new HtmlWebpackPlugin({
      template: "./index.html"
    })*/
    new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './index.html',
    chunks: ['main']
  }),/*
  new HtmlWebpackPlugin({
    filename: 'e/index.html',
    template: './index.html',
    chunks: ['editor']
  })*/
  ]
};
