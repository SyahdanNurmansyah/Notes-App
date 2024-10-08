exports.shorthands = undefined;
exports.up = (pgm) => {

    pgm.createTable('collaborations', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },

        note_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },

        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        }
    });

    /*

    Menambahkan constraint UNIQUE, kombinasi dari kolom note_id dan user_id.
    Guna menghindari duplikasi data antara nilai keduanya.

    */

    pgm.addConstraint('collaborations', 'unique_note_id_and_user_id', 'UNIQUE(note_id, user_id)');

    // Memberikan constraint foreign key pada kolom note_id dan user_idterhadap notes.id dan users.id

    pgm.addConstraint('collaborations', 'fk_collaborations.note_id_notes.id', 'FOREIGN KEY(note_id) REFERENCES notes(id) ON DELETE CASCADE');
    pgm.addConstraint('collaborations', 'fk_collaborations.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE')

};
exports.down = (pgm) => {

    // Menghapus table collaborations
    pgm.dropTable('collaborations')
};
