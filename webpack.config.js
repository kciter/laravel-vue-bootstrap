var path = require('path');
var webpack = require('webpack');
var Mix = require('laravel-mix').config;
var plugins = require('laravel-mix').plugins;

/*
 |--------------------------------------------------------------------------
 | Mix Initialization
 |--------------------------------------------------------------------------
 |
 | As our first step, we'll require the project's Laravel Mix file
 | and record the user's requested compilation and build steps.
 | Once those steps have been recorded, we may get to work.
 |
 */

Mix.initialize();

/*
 |--------------------------------------------------------------------------
 | Webpack Context
 |--------------------------------------------------------------------------
 |
 | This prop will determine the appropriate context, when running Webpack.
 | Since you have the option of publishing this webpack.config.js file
 | to your project root, we will dynamically set the path for you.
 |
 */

module.exports.context = Mix.Paths.root();


/*
 |--------------------------------------------------------------------------
 | Webpack Entry
 |--------------------------------------------------------------------------
 |
 | We'll first specify the entry point for Webpack. By default, we'll
 | assume a single bundled file, but you may call Mix.extract()
 | to make a separate bundle specifically for vendor libraries.
 |
 */

module.exports.entry = Mix.entry();


/*
 |--------------------------------------------------------------------------
 | Webpack Output
 |--------------------------------------------------------------------------
 |
 | Webpack naturally requires us to specify our desired output path and
 | file name. We'll simply echo what you passed to with Mix.js().
 | Note that, for Mix.version(), we'll properly hash the file.
 |
 */

module.exports.output = Mix.output();


/*
 |--------------------------------------------------------------------------
 | Rules
 |--------------------------------------------------------------------------
 |
 | Webpack rules allow us to register any number of loaders and options.
 | Out of the box, we'll provide a handful to get you up and running
 | as quickly as possible, though feel free to add to this list.
 |
 */
module.exports.module = {
  rules: [
    // ESLint
    {
      test: /\.(js|vue)$/,
      loader: 'eslint-loader',
      enforce: 'pre',
      exclude: /node_modules/,
      options: {
        formatter: require('eslint-friendly-formatter')
      }
    },

    // Style
    {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
          js: 'babel-loader' + Mix.babelConfig(),
          scss: plugins.ExtractTextPlugin.extract({
            fallback: 'vue-style-loader',
            use: 'css-loader!sass-loader'
          }),
          sass: plugins.ExtractTextPlugin.extract({
            fallback: 'vue-style-loader',
            use: 'css-loader!sass-loader?indentedSyntax'
          })
        },

        postcss: [
          require('autoprefixer')
        ]
      }
    },

    // Babel
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader' + Mix.babelConfig()
    },

    // Image
    {
      test: /\.(png|jpe?g|gif)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]?[hash]'
      }
    },

    // Font
    {
      test: /\.(woff2?|ttf|eot|svg|otf)$/,
      loader: 'file-loader',
      options: {
        name: 'fonts/[name].[ext]?[hash]',
        publicPath: '/'
      }
    }
  ]
};

if (Mix.preprocessors) {
  Mix.preprocessors.forEach(toCompile => {
    let extractPlugin = new plugins.ExtractTextPlugin(
      Mix.cssOutput(toCompile)
    );

    let sourceMap = Mix.sourcemaps ? '?sourceMap' : '';

    module.exports.module.rules.push({
      test: new RegExp(toCompile.src.path.replace(/\\/g, '\\\\') + '$'),
      loader: extractPlugin.extract({
        fallback: 'style-loader',
        use: [
          { loader: 'css-loader' + sourceMap },
          { loader: 'postcss-loader' + sourceMap }
        ].concat(
          toCompile.type == 'sass' ? [
            { loader: 'resolve-url-loader' + sourceMap },
            {
              loader: 'sass-loader?sourceMap',
              options: Object.assign({
                precision: 8,
                outputStyle: 'expanded'
              }, toCompile.pluginOptions)
            }
          ] : [
            {
              loader: 'less-loader' + sourceMap,
              options: toCompile.pluginOptions
            }
          ]
        )
      })
    });

    module.exports.plugins = (module.exports.plugins || []).concat(extractPlugin);
  });
}



/*
 |--------------------------------------------------------------------------
 | Resolve
 |--------------------------------------------------------------------------
 |
 | Here, we may set any options/aliases that affect Webpack's resolving
 | of modules. To begin, we will provide the necessary Vue alias to
 | load the Vue common library. You may delete this, if needed.
 |
 */

module.exports.resolve = {
  extensions: ['*', '.js', '.vue'],
  alias: {
    'vue$': 'vue/dist/vue.common.js'
  }
};



/*
 |--------------------------------------------------------------------------
 | Stats
 |--------------------------------------------------------------------------
 |
 | By default, Webpack spits a lot of information out to the terminal,
 | each you time you compile. Let's keep things a bit more minimal
 | and hide a few of those bits and pieces. Adjust as you wish.
 |
 */

module.exports.stats = {
  hash: false,
  version: false,
  timings: false,
  children: false,
  errors: false
};

module.exports.performance = { hints: false };



/*
 |--------------------------------------------------------------------------
 | Devtool
 |--------------------------------------------------------------------------
 |
 | Sourcemaps allow us to access our original source code within the
 | browser, even if we're serving a bundled script or stylesheet.
 | You may activate sourcemaps, by adding Mix.sourceMaps().
 |
 */

module.exports.devtool = (Mix.inProduction ? '#source-map' : '#cheap-module-eval-source-map');



/*
 |--------------------------------------------------------------------------
 | Webpack Dev Server Configuration
 |--------------------------------------------------------------------------
 |
 | If you want to use that flashy hot module replacement feature, then
 | we've got you covered. Here, we'll set some basic initial config
 | for the Node server. You very likely won't want to edit this.
 |
 */
module.exports.devServer = {
  historyApiFallback: true,
  noInfo: true,
  compress: true,
  quiet: true,
  overlay: true
};



/*
 |--------------------------------------------------------------------------
 | Plugins
 |--------------------------------------------------------------------------
 |
 | Lastly, we'll register a number of plugins to extend and configure
 | Webpack. To get you started, we've included a handful of useful
 | extensions, for versioning, OS notifications, and much more.
 |
 */

module.exports.plugins = (module.exports.plugins || []).concat([
  new plugins.FriendlyErrorsWebpackPlugin(),

  new plugins.StatsWriterPlugin({
    filename: 'mix-manifest.json',
    transform: Mix.manifest.transform.bind(Mix.manifest)
  }),

  new plugins.WebpackMd5HashPlugin(),

  new webpack.LoaderOptionsPlugin({
    minimize: Mix.inProduction,
    options: {
      postcss: [
        require('autoprefixer')
      ],
      context: __dirname,
      output: { path: './' }
    }
  })
]);

if (Mix.notifications) {
  module.exports.plugins.push(
    new plugins.WebpackNotifierPlugin({
      title: 'Laravel Mix',
      alwaysNotify: true,
      contentImage: Mix.Paths.root('node_modules/laravel-mix/icons/laravel.png')
    })
  );
}


module.exports.plugins.push(
  new plugins.WebpackOnBuildPlugin(
    stats => Mix.events.fire('build', stats)
  )
);

if (Mix.copy) {
  Mix.copy.forEach(copy => {
    module.exports.plugins.push(
      new plugins.CopyWebpackPlugin([copy])
    );
  });
}

if (Mix.extract) {
  module.exports.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      names: Mix.entryBuilder.extractions.concat([
        path.join(Mix.js.base, 'manifest')
      ]),
      minChunks: Infinity
    })
  );
}

// Development
if (!Mix.inProduction) {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]);
}

// Production
if (Mix.inProduction) {
  module.exports.plugins = module.exports.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),

    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
        drop_console: true
      }
    })
  ]);
}

/*
 |--------------------------------------------------------------------------
 | Mix Finalizing
 |--------------------------------------------------------------------------
 |
 | Now that we've declared the entirety of our Webpack configuration, the
 | final step is to scan for any custom configuration in the Mix file.
 | If mix.webpackConfig() is called, we'll merge it in, and build!
 |
 */
Mix.finalize(module.exports);
