require('dotenv').config();

const Hapi = require ('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');

// Notes
const notes = require('./api/notes');
const NotesService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');

// Users
const users = require('./api/users')
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const init = async () => {
    
    const notesService = new NotesService();
    const usersService = new UsersService();

    const server = Hapi.server ({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register ([
        {
            plugin: notes,
            options: {
                service: notesService,
                validator: NotesValidator,
            },
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator,
            },
        },
    ]);

    server.ext ('onPreResponse', (request, h) => {

        const { response } = request;
        
        // Penanganan client error secara internal
        if (response instanceof Error) {
            if (response instanceof ClientError) {
                const newResponse = h.response ({
                    status: 'fail',
                    message: response.message,
                });

                newResponse.code(response.statusCode);
                return newResponse;
            };

            // Mempertahankan penanganan client error oleh Hapi secara nantive, serperti 404, etc.
            if (!response.isServer) {
                return h.continue;
            };

            // Penanganan server error sesaui kebutuhan
            const newResponse = h.response ({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });

            newResponse.code(500);
            return newResponse;
        }

        // Jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
        return h.continue;
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();