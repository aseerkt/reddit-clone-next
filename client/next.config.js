module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: { and: [/\.tsx?$/] },
      use: ['@svgr/webpack'],
    });

    return config;
  },
  images: {
    domains: [
      'www.gravatar.com',
      'images.pexels.com',
      String(process.env.APP_DOMAIN),
    ],
  },
};
