const autoBind = require("auto-bind");

class ExportsHandler {
    constructor (service, validator) {

        this._service = service;
        this._validator = validator;

        autoBind(this);
    };

    async postExportNotesHandler (request, h) {

        this._validator.validateExportNotesPayload(request.payload);

        // buat objek message yang akan dikirim ke queue
        const message =  {
            userId: request.auth.credentials.id,
            targetEmail: request.payload.targetEmail,
        };

        // selanjutnya kirim pesan tersebut ke queue menggunakan this._service.sendMessage dalam bentuk string. ‘export:notes’ sebagai nama queue-nya.
        await this._service.sendMessage('export:notes', JSON.stringify(message));

        const response = h.response ({
            status: 'success',
            message: 'Permintaan Anda dalam antrean',
        });

        response.code(201);
        return response;
    };
};

module.exports = ExportsHandler;