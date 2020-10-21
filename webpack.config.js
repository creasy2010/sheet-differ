const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const copyWebpackPlugin = require('copy-webpack-plugin')
const { greenBright } = require('chalk')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

/** @type {()=> import('webpack').Configuration} */
module.exports = (_env, args) => {
  const __prod__ = args.mode === 'production'

  for (const key in args) {
    console.log(greenBright(`${key}: ${JSON.stringify(args[key])}`))
  }

  return {
    mode: args.mode,
    devtool: __prod__ ? false : 'inline-source-map',
    entry: {
      main: './src/app.ts'
    },
    output: {
      path: path.resolve('./dist'),
      filename: 'js/[name].js',
      libraryTarget: 'umd'
    },
    resolve: {
      extensions: ['.ts', '.js', 'scss', 'css'],
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    devServer: {
      contentBase: './dist',
      open: false,
      stats: 'errors-only',
      host: '0.0.0.0',
      compress: true,
      useLocalIp: true,
      watchOptions: {
        ignored: /__tests__/
      }
    },
    optimization: {
      minimize: __prod__,
      minimizer: [
        new TerserPlugin({
          test: /\.js(\?.*)?$/i
        })
      ]
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                compilerOptions: {
                  declaration: false
                }
              }
            }
          ],
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: ['./dist']
      }),
      new HtmlWebpackPlugin({
        template: './public/index.ejs',
        inject: true,
        favicon: './public/favicon.ico',
        chunks: ['main'],
        minify: {
          collapseWhitespace: __prod__,
          removeComments: true
        }
      }),
      new copyWebpackPlugin({
        patterns: [
          {
            from: path.resolve('./public'),
            to: path.resolve('./dist'),
            toType: 'dir',
            globOptions: {
              ignored: ['**/index.ejs']
            }
          }
        ]
      })
    ]
  }
}
