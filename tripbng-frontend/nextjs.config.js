// next.config.js
module.exports = {
  swcMinify: true,
  images: {
    domains: [
      'tripbng-airline.s3.us-east-1.amazonaws.com',
      'cdn.anotherhost.com',
      'images.example.com',
      'upload.wikimedia.org'
    ],
  },
};
