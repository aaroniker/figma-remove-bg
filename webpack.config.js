const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = (env, argv) => ({
    mode: argv.mode === 'production' ? 'production' : 'development',
    devtool: argv.mode === 'production' ? false : 'inline-source-map',
    entry: {
        ui: './src/ui.ts',
        code: './src/code.ts'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: [{
                    loader: 'style-loader'
                },
                {
                    loader: 'css-loader'
                }]
            },
            {
                test: /\.(png|jpg|gif|webp|svg)$/,
                loader: [{
                    loader: 'url-loader'
                }]
            },
            {
                test: /\.module\.s(a|c)ss$/,
                loader: [
                    argv.mode !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[name]__[local]___[hash:base64:5]',
                            camelCase: true,
                            sourceMap: argv.mode !== 'production'
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: argv.mode !== 'production'
                        }
                    }
                ]
            },
            {
                test: /\.s(a|c)ss$/,
                exclude: /\.module.(s(a|c)ss)$/,
                loader: [
                    argv.mode !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: argv.mode !== 'production'
                        }
                    }
                ]
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.scss']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/ui.html',
            filename: 'ui.html',
            inlineSource: '.(js|css)$',
            chunks: ['ui'],
        }),
        new HtmlWebpackInlineSourcePlugin(),
        new MiniCssExtractPlugin({
            filename: argv.mode !== 'production' ? '[name].css' : '[name].[hash].css',
            chunkFilename: argv.mode !== 'production' ? '[id].css' : '[id].[hash].css'
        })
    ]
})
