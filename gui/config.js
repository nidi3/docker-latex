var config;
if (process.env.ENV === 'dev') {
    config = {
        dir: '..',
        server: 'http://192.168.99.100'
    };
} else {
    config = {
        dir: '/data',
        server: 'http://server'
    };
}

module.exports = config;