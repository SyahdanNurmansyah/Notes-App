require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const ClientError = require('./exceptions/ClientError');

// Notes
const notes = require('./api/notes');
const NotesService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');

// Users
const users = require('./api/users')
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// Authentications
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const authentications = require('./api/authentications');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications')

const init = async () => {
    
    const notesService = new NotesService();
    const usersService = new UsersService();
    const authenticationsService = new AuthenticationsService();

    const server = Hapi.server ({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    // Registrasi plugin eksternal
    await server.register ([
        {
            plugin: Jwt,
        },
    ]);

    // Mendefinisikan strategy autentikasi jwt
    server.auth.strategy('noteapp_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },

        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
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
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            }
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