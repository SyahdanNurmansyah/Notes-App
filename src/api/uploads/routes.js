const path = require('path');

const routes = (handler) => [
    {
        method: 'POST',
        path: '/upload/images',
        handler: handler.postUploadImageHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
                output: 'stream',
            },
        },
    },

    // Melayani Berkas Statis di Hapi
    {
        method: 'GET',
        path: '/upload/{param*}',
        handler: {
            directory: {
                path: path.resolve(__dirname, 'file'),
            },
        },
    },
];

module.exports = routes;