'use strict';

var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const os = require('os');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const devMode = process.env.NODE_ENV !== 'production';
module.exports = {
    entry: ['./src/index.tsx'],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: {
            // 减少使用别名提高编译速速
            '@api': path.join(__dirname, './src/api'),
            '@components': path.join(__dirname, './src/components'),
            '@pages': path.join(__dirname, './src/pages'),
            '@common': path.join(__dirname, './src/components/common'),
            '@Header': path.join(
                __dirname,
                './src/components/header/Header.tsx'
            ),
            '@PrivateRoute': path.join(
                __dirname,
                './src/components/common/PrivateRoute.tsx'
            ),
            '@context': path.join(__dirname, './src/context'),
            '@reducers': path.join(__dirname, './src/reducers'),
            '@Routes': path.join(__dirname, './src/routes/Routes.tsx'),
            '@assets': path.join(__dirname, './src/assets'),
            '@Utils': path.join(__dirname, './src/util/utils.tsx'),
            '@App': path.join(__dirname, './src/pages/App.tsx'),
            '@config': path.join(__dirname, './src/config.tsx'),
        },
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index_bundle.js',
        publicPath: '/',
    },
    optimization: {
        usedExports: true,
        runtimeChunk: {
            name: 'runtime',
        },
        splitChunks: {
            chunks: 'all', // 共有三个值可选：initial(初始模块)、async(按需加载模块)和all(全部模块)
            minSize: 30000, // 模块超过30k自动被抽离成公共模块
            minChunks: 1, // 模块被引用>=1次，便分割
            name: true, // 默认由模块名+hash命名，名称相同时多个模块将合并为1个，可以设置为function
            automaticNameDelimiter: '~', // 命名分隔符
            cacheGroups: {
                default: {
                    // 模块缓存规则，设置为false，默认缓存组将禁用
                    minChunks: 2, // 模块被引用>=2次，拆分至vendors公共模块
                    priority: -20, // 优先级
                    reuseExistingChunk: true, // 默认使用已有的模块
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    // minChunks: 1,
                    priority: -10, // 确定模块打入的优先级
                    reuseExistingChunk: true, // 使用复用已经存在的模块
                    enforce: true,
                },
                'draft-js': {
                    test: /[\\/]node_modules[\\/]draft-js/,
                    name: 'draft-js',
                    priority: 18,
                    reuseExistingChunk: true,
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'awesome-typescript-loader',
                },
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                enforce: 'pre',
                use: [
                    {
                        loader: 'tslint-loader',
                        options: {
                            configFile: 'tslint.json',
                            tsConfigFile: 'tsconfig.json',
                        },
                    },
                ],
            },

            {
                test: /\.(css|less)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: devMode,
                            reloadAll: devMode,
                        },
                    },
                    'happypack/loader?id=happyStyle',
                ],
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: 'imgs/[name]-[hash].[ext]',
                },
            },
            {
                type: 'javascript/auto',
                test: /config\.settings\.json$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]',
                },
            },
            {
                test: /\.md$/,
                use: [
                    {
                        loader: "html-loader"
                    },
                    {
                        loader: "markdown-loader",
                    }
                ]
            }
        ],
    },
    devServer: {
        publicPath: '/',
        port: 10000,
        historyApiFallback: {
            //用于解决开发环境中刷新404的问题
            index: '/index.html'
        },
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './public/index.html', favicon: './public/favicon.ico', hash: true }),
        new HappyPack({
            //用id来标识 happypack处理那里类文件
            id: 'happyBabel',
            //如何处理  用法和loader 的配置一样
            loaders: [
                {
                    loader: 'babel-loader',
                    options: {
                        // babelrc: true,
                        cacheDirectory: true, // 启用缓存
                        presets: ['es2015', 'react', 'stage-0'],
                        "plugins": [
                            ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]
                        ]
                    },
                },
            ],
            //代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多。
            threadPool: happyThreadPool,
            //允许 HappyPack 输出日志
            verbose: false,
        }),
        new HappyPack({
            //用id来标识 happypack处理那里类文件
            id: 'happyStyle',
            //如何处理  用法和loader 的配置一样
            loaders: [
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2, // 之前有2个loaders
                        // modules: true, // 启用cssModules
                        sourceMap: true,
                    },
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true, //为true,在样式追溯时，显示的是编写时的样式，为false，则为编译后的样式
                    },
                },
                {
                    loader: 'less-loader',
                    options: {
                        sourceMap: true,
                    },
                },
            ],
            //代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多。
            threadPool: happyThreadPool,
            //允许 HappyPack 输出日志
            verbose: false,
        }),
        //new BundleAnalyzerPlugin(),
        new MiniCssExtractPlugin({
            filename: devMode ? 'css/style.css' : 'css/style.[contenthash].css',
            chunkFilename: devMode
                ? 'css/style.[id].css'
                : 'css/style.[contenthash].[id].css',
        }),
    ],
};
