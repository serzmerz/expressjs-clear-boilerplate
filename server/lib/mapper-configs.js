/* eslint-disable */
const path = require('path');
const _ = require('lodash');

/**
 * @param {String} configsDir
 * @param {...String} name
 * @returns {Object} {get: Function, merge: Function}
 */
module.exports = function configs(configsDir, name) {
    const config = {};
    let i = 2;
    let configPath;

    do {
        configPath = path.resolve(configsDir, name);

        try {
            configPath = require.resolve(configPath);
        } catch (e) {
            continue;
        }

        mergeToConfig(require(configPath)); // eslint-disable-line global-require
    } while (i < arguments.length && (name = arguments[i++]));

    function getInConfig(p, def) {
        if (! arguments.length) {
            return _.clone(config);
        }
        return _.get(config, p, def);
    }

    function mergeToConfig(src) {
        return _.merge(config, src);
    }

    return {
        get: getInConfig,
        merge: mergeToConfig
    };
};
