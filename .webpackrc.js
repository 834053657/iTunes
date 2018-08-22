const path = require('path');

console.log('process.env.KG_API_ENV', process.env.KG_API_ENV, process.env.KG_API_ENV == 'test');

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  define: {
    __KG_API_ENV__: process.env.KG_API_ENV,
    __KG_DATATIME__: new Date().toLocaleString(),
  },
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr', [
		'react-intl', {
		  messagesDir: './src/i18n-messages',
		}
	  ]],
      define: {
        __KG_API_ENV__: process.env.KG_API_ENV,
        __KG_DATATIME__: new Date().toLocaleString(),
      },
    },
    test: {
      define: {
        __KG_API_ENV__: process.env.KG_API_ENV,
        __KG_DATATIME__: new Date().toLocaleString(),
      },
    },
    production: {
      define: {
        __KG_API_ENV__: process.env.KG_API_ENV,
        __KG_DATATIME__: new Date().toLocaleString(),
      },
      extraBabelPlugins: [ ["transform-remove-console", { "exclude": [ "error", "warn"] }] ]
    },
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  disableDynamicImport: false,
  publicPath: '/',
  hash: true,
};
