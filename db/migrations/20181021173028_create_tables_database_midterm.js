// creates tables in the midterm database

exports.up = function(knex, Promise) {

  return knex.schema

        .createTable('users', function (table) {
          table.increments();
          table.string('name').unique().notNullable();
          table.string('password').notNullable();
          table.uuid('token');
        })

        .createTable('resources', function (table) {
          table.increments();
          table.string('title').notNullable();
          table.string('resource_url').notNullable();
          table.string('image_url');
          table.text('description');
          table.bigInteger('created_at').notNullable();
          table.integer('likes');
          table.decimal('rating');
          table.integer('users_id').references('id').inTable('users').notNullable().onDelete('CASCADE').onUpdate('RESTRICT');
        })

        .createTable('tags', function (table) {
          table.increments();
          table.string('name').unique().notNullable();
        })

        .createTable('resource_tags', function (table) {
          table.increments();
          table.integer('resources_id').references('id').inTable('resources').notNullable().onDelete('CASCADE').onUpdate('RESTRICT');
          table.integer('tags_id').references('id').inTable('tags').notNullable().onDelete('CASCADE').onUpdate('RESTRICT');
        })

        .createTable('comments', function (table) {
          table.increments();
          table.text('comment');
          table.string('users_name').references('name').inTable("users").notNullable().onDelete('CASCADE').onUpdate('RESTRICT');
          table.integer('resources_id').references('id').inTable('resources').notNullable().onDelete('CASCADE').onUpdate('RESTRICT');
        })

        .createTable('ratings', function (table) {
          table.increments();
          table.integer('rating').notNullable();
          table.integer('resources_id').references('id').inTable('resources').notNullable().onDelete('CASCADE').onUpdate('RESTRICT');
          table.integer('users_id').references('id').inTable("users").notNullable().onDelete('CASCADE').onUpdate('RESTRICT');
        })

        .createTable('likes', function (table) {
          table.increments();
          table.integer('users_id').references('id').inTable("users").notNullable().onDelete('CASCADE').onUpdate('RESTRICT');
          table.integer('resources_id').references('id').inTable('resources').notNullable().onDelete('CASCADE').onUpdate('RESTRICT');
        });
};

exports.down = function(knex, Promise) {

  return knex.schema
        .dropTable('likes')
        .dropTable('ratings')
        .dropTable('comments')
        .dropTable('resource_tags')
        .dropTable('tags')
        .dropTable('resources')
        .dropTable('users');
};
