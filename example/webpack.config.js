const path = require('path');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

const root = path.resolve(__dirname, '..');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.module.rules.push({
    test: /\.(js|jsx|ts|tsx)$/,
    include: path.resolve(root, 'src'),
    use: 'babel-loader',
  });

  return config;
};
