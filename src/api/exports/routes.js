const routes = (handler) => [
    {
        method: 'POST',
        path: '/export/notes',
        handler: handler.postExportNotesHandler,
        options: {
            auth: 'noteapp_jwt',
        },
    },
];

module.exports = routes;