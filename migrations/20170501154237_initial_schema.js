
exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('Team', table => {
            table.increments('id').primary().notNullable();
            table.timestamps(true, true);
            table.string('name').notNullable();
        })
        .createTable('User', table => {
            table.increments('id').primary().notNullable();
            table.timestamps(true, true);
            table.string('email').notNullable();
            table.string('password').notNullable();
            table.string('name').notNullable();
            table.string('avatar_url').notNullable();
            table.string('position').notNullable();
            table.integer('team_id').unsigned().references('id').inTable('Team').notNullable();
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTableIfExists('Team')
        .dropTableIfExists('User');
};
