exports.up = (pgm) => {
    pgm.createTable('notes', {

        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },

        title: {
            type: 'TEXT',
            notNull: true,
        },

        body: {
            type: 'TEXT',
            notNull: true,
        },
        
        tags: {
            type: 'VARCHAR(30)[]',
            notNull: true,
        },

        created_at: {
            type: 'TEXT',
            notNull: true,
        },

        updated_at: {
            type: 'TEXT',
            // type: 'TIMESTAMP WITH TIME ZONE',
            notNull: true,
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('notes');
};