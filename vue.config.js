module.exports = {
  lintOnSave: false,
  devServer: {
    // Temporarily deal with https://github.com/webpack/webpack-dev-server/issues/1604
    disableHostCheck: true,
  },
};
