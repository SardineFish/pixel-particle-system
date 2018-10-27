const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/main.ts",
  },
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname,"dist/script"),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: "ts-loader"
    }]
  }
};