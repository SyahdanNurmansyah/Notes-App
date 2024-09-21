const autoBind = require("auto-bind");

class UploadsHandler {
    constructor (service, validator) {

        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    async postUploadImageHandler (request, h) {

        const { data } = request.payload;

        // validasi nilai data.hapi.headers menggunakan this._validator.validateImageHeaders. Hal ini bertujuan untuk memastikan objek headers memiliki content-type yang sesuai.
        this._validator.validateImageHeaders(data.hapi.headers);

        // setelah tervalidasi, langsung tulis berkas yang dikirim pada storage melalui fungsi this._service.writeFile. Berikan data sebagai parameter file dan data.hapi sebagai parameter meta.

        //  fungsi writeFile mengembalikan nama berkas (filename) yang ditulis. Kita bisa memanfaatkan nama berkas ini dalam membuat nilai fileLocation dan mengembalikannya sebagai response.
         
        const filename = await this._service.writeFIle(data, data.hapi);

        const response = h.response ({
            status: 'success',
            data: {
                fileLocation: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
            },
        });

        response.code(201);
        return response;
    };
};

module.exports = UploadsHandler;