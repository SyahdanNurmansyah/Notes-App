const routes = (handler) => [
    {
        method: 'POST',
        path: '/collaborations',
        handler: handler.postCollaborationHandler,
        options: {
            auth: 'noteapp_jwt',
        }
    },
    {
        method: 'DELETE',
        path: '/collaborations',
        handler: handler.deleteCollaborationHandler,
        options: {
            auth: 'noteapp_jwt',
        }
    },
];

module.exports = routes;