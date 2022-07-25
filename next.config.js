const WindiCSSWebpackPlugin = require('windicss-webpack-plugin');
const withTM = require('next-transpile-modules')(['ky']);

/** @type {import('next').NextConfig} */
let nextConfig = {
	reactStrictMode: true,
	swcMinify: false,
	webpack: (config) => {
		config.plugins.push(new WindiCSSWebpackPlugin());
		return config;
	},
};

nextConfig = withTM(nextConfig);

module.exports = nextConfig;
