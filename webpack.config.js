const path = require('path')

module.exports = {
    entry: "./intermediate/js/Start/Login/index.js",
    output : {
        filename: "bundle.js",
        path: __dirname  + "/dist"
    },
    devtool: "source-map",
    resolve: {
        alias: {
            '@': path.join(__dirname, './'), 
          },
        extensions: ["js"]
    },
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            // { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    }
}