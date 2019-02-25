const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const dirs = {
  dev: "src",
  prod: "public"
}

const config = {
  entry: path.resolve(__dirname, dirs.dev, "ts", "index.ts"),
  output: {
    path: path.resolve(__dirname, dirs.prod)
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".ts", ".js", ".scss"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, dirs.dev, "html", "index.html"),
      filename: "index.html"
    })
  ]
};

module.exports = { config, dirs }
