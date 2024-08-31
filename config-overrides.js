const { override, useBabelRc } = require('customize-cra');

module.exports = {
    webpack: override(useBabelRc()),
};
