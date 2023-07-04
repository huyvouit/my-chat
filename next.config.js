const withImages = require('next-images')

module.exports = withImages()

module.exports = {
  //distDir: 'build',
  reactStrictMode: false,
  swcMinify: true,
  env: {
    MAIN_URL: process.env.MAIN_URL,
    SOCKET_URL: process.env.SOCKET_URL,
    ADMIN_TOKEN: process.env.ADMIN_TOKEN,
  }
}