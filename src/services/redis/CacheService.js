const redis = require('redis');

class CacheService {
    constructor () {

        this._client = redis.createClient({
            socket: {
                host: process.env.REDIS_SERVER,
            },
        });

        this._client.on('error', (error) => {
            console.error(error);

            // Kode di atas menunjukkan bahwa kita membuat private properti this._client yang bernilai client Redis. Client tersebut dibuat menggunakan perintah createClient yang memanfaatkan package redis. Melalui properti this._client inilah nantinya kita bisa mengoperasikan Redis server.
        });

        this._client.connect();
    };

    // Menyimpan nilai pada cache serta masa kedaluarsa secara default 1 jam
    async set(key, value, expirationInSecond = 3600 ) {
        await this._client.set(key, value, {
            EX: expirationInSecond,
        });
    }

    async get(key) {
        const result = await this._client.get(key);

        if (result === null) throw new Error('Cache tidak ditemukan');

        return result;
    }

    delete(key) {
        return this._client.del(key);
    }
};

module.exports = CacheService;