const envs = require('./env');

const config = {
  production: {
    SECRET: envs.DB_SECRET,
    DATABASE: envs.MONGODB_URI,
  },
  default: {
    SECRET: 'mysecretkey',
    // We are going to connect to a trivia-dev DB collection if this is not production to keep the production data clean.
    DATABASE: envs.MONGODB_URI_LOCAL,
  },
};

exports.get = function get(env) {
  return config[env] || config.default;
};
