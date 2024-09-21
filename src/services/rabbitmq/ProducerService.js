// Pada pembuatan ProducerService, kita tidak menggunakan class, melainkan cukup dengan objek biasa. Hal ini karena kita tidak membutuhkan adanya penggunaan keyword this yang merujuk pada instance dari class. Berbeda dengan service postgres, kita membutuhkan this untuk mengakses properti _pool.


const amqp = require('amqplib');

const ProducerService = {

    // Fungsi sendMessage ini nantinya akan digunakan pada fungsi handler dari permintaan ekspor yang masuk.
    sendMessage: async (queue, message) => {

    // tuliskan kode di dalam fungsi sendMessage untuk mengirimkan pesan ke queue

        // connection ke RabbitMQ server
        const connection = await amqp.connect(process.env.RABBITMQ_SERVER);

        // buat channel menggunakan fungsi connection.createChannel
        const channel = await connection.createChannel();

        // memastikan queue terdaftar menggunakan channel.assertQueue
        await channel.assertQueue(queue, {
            durable: true,
        });

        // kirim pesan dalam bentuk Buffer ke queue dengan menggunakan perintah channel.sendToQueue.

        await channel.sendToQueue(queue, Buffer.from(message));

        // BEST PRACTICE: tutup koneksi setelah satu detik berlangsung dari pengiriman pesan.

        setTimeout(() => {
            connection.close();
        }, 1000);

        console.log(queue);
        console.log(message);
    },
};

module.exports = ProducerService;