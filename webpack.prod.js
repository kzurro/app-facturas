const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const CleanWebpackPlugin = require("clean-webpack-plugin");


module.exports = merge(common.config, {
  mode: "production",
  output: {
    filename: "js/scripts.[hash].js"
  },
  plugins: [
    new CleanWebpackPlugin([
      path.resolve(__dirname, common.dirs.prod)
    ])
  ]
});
