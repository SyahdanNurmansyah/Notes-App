const autoBind = require("auto-bind");

class CollaborationsHandler {
    constructor (collaborationsService, notesService, validator) {

        this._collaborationsService = collaborationsService;
        this._notesService = notesService;
        this._validator = validator;

        autoBind(this);
    }

    async postCollaborationHandler (request, h) {

        this._validator.validateCollaborationPayload(request.payload);

        // Pengguna yang mengajukan permintaan haruslah owner dari catatan tersebut
        const { id: credentialId } = request.auth.credentials;
        const { noteId, userId } = request.payload;

        await this._notesService.verifyNoteOwner(noteId, credentialId);

        // Selanjutnya kita bisa aman untuk menambahkan kolaborasi pada catatan tersebut
        const collaborationId = await this._collaborationsService.addCollaboration(noteId, userId);

        const response = h.response ({
            status: 'success',
            message: 'Kolaborator berhasil ditambahkan',
            data: {
                collaborationId,
            },
        });

        response.code(201);
        return response;
    };

    async deleteCollaborationHandler (request) {

        this._validator.validateCollaborationPayload(request.payload);

        const { id: credentialId } = request.auth.credentials;
        const { noteId, userId } = request.payload;

        await this._notesService.verifyNoteOwner(noteId, credentialId);
        await this._collaborationsService.deleteCollaboration(noteId, userId);

        return {
            status: 'success',
            message: 'Kolaborator berhasil dihapus',
        };
    };
};

module.exports = CollaborationsHandler;