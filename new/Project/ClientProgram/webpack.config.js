const webpack = require("webpack");
const path    = require('path');

module.exports = (env) =>
{
    //-------------------------
    // Build config definitions
    //-------------------------
    const stdconfig = 
    {
        resolve: 
        {
            extensions:
            [
                '.ts',
                '.js'
            ],

            modules: 
            [
                path.resolve('./src/css'),
                path.resolve('./src/img'),
                path.resolve('./src/html'),
                path.resolve('./src/js'),
                path.resolve('./src/ts'),
            ]
        },

        context: path.resolve(__dirname, './src/'),

        entry: './ts/main.ts',

        output: 
        {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist')
        },

        plugins: 
        [
        ],

        module: 
        {
            rules: 
            [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: 'ts-loader'
                },

                {
                    test: /\.(html|ico)$/,
                    exclude: /node_modules/,
                    use: 
                    [
                        {
                            loader: 'file-loader',
                            options: 
                            {
                                name: '[name].[ext]'
                            }  
                        }
                    ]
                },

                {
                    test: /\.(css)$/,
                    exclude: /node_modules/,
                    use: 
                    [
                        {
                            loader: 'file-loader',
                            options: 
                            {
                                name: '/css/[name].[ext]'
                            }  
                        }
                    ]
                },

                {
                    test: /\.(png|jpg|gif)$/,
                    exclude: /node_modules/,
                    use: 
                    [
                        {
                            loader: 'file-loader',
                            options: 
                            {
                                name: '/img/[name].[ext]'
                            }  
                        }
                    ]
                }
            ]
        }
    };

    const debugcfg =
    {
        devtool: 'inline-source-map'
    }

    const releasecfg =
    {
        plugins: 
        [
            new webpack.optimize.UglifyJsPlugin
            ({
                parallel: true,
                mangle: true,

                minimize: true,
                
                compress: 
                {
                    passes: 10
                },

                warnings: true
            }),
        ]
    };

    //--------------------
    // Export final config
    //--------------------
    let config;

    if (env.release === true)
    {
        config = Object.assign(stdconfig, releasecfg);
    }
    else if (env.debug === true)
    {
        config = Object.assign(stdconfig, debugcfg);
    }

    //--------------------
    // Entrypoint override
    //--------------------
    if (typeof env.main === "string")
        config.entry = "./ts/" + env.main + ".ts";

    return config;
}
