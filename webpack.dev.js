const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common.config, {
  mode: "development",
  output: {
    filename: "js/scripts.js"
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, common.dirs.prod),
    watchContentBase: true
  }
});
