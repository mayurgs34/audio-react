const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const port = process.env.PORT || 3000;

module.exports = {
    resolve: {
        modules: ['node_modules'],
        alias: {
          public: path.join(__dirname, './public')
        }
      },
};