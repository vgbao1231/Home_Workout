const { override, useBabelRc } = require('customize-cra');

module.exports = {
    webpack: override(useBabelRc()),
    devServer: (configFunction) => (proxy, allowedHost) => {
        const config = configFunction(proxy, allowedHost);

        // Thêm các header vào devServer
        config.headers = {
            'Cross-Origin-Embedder-Policy': 'unsafe-none',
            'Cross-Origin-Opener-Policy': 'unsafe-none',
        };

        return config;
    },
};
