const routes = (handler) => [
    {
        method: 'POST',
        path: '/notes',
        handler: handler.postNoteHandler,
        options: {
            auth: 'noteapp_jwt',
        },
    },
    {
        method: 'GET',
        path: '/notes',
        handler: handler.getNotesHandler,
        options: {
            auth: 'noteapp_jwt',
        },
    },
    {
        method: 'GET',
        path: '/notes/{id}',
        handler: handler.getNoteByIdHandler,
        options: {
            auth: 'noteapp_jwt',
        },
    },
    {
        method: 'PUT',
        path: '/notes/{id}',
        handler: handler.putNoteByIdHandler,
        options: {
            auth: 'noteapp_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/notes/{id}',
        handler: handler.deleteNoteByIdHandler,
        options: {
            auth: 'noteapp_jwt',
        },
    },
];

module.exports = routes;