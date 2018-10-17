exports.up = function(knex, Promise) {

  return knex.schema

        .table('users', function (table) {
          table.string('password');
        })
        .createTable('resources', function (table) {
          table.increments();
          table.string('title');
          table.string('resource_URL');
          table.text('description');
          table.integer('created_at');
          table.integer('likes');
          table.integer('rating');
          table.integer('users_id').references('id').inTable('users');
        })
        .createTable('tags', function (table) {
          table.increments();
          table.string('name');
        })
        .createTable('resourceTags', function (table) {
          table.increments();
          table.integer('resources_id').references('id').inTable('resources');
          table.integer('tags_id').references('id').inTable('tags');
        })
        .createTable('comments', function (table) {
          table.increments();
          table.text('comment');
          table.integer('users_id').references('id').inTable("users");
          table.integer('resources_id').references('id').inTable('resources');
        })
        .createTable('ratings', function (table) {
          table.increments();
          table.integer('rating');
          table.integer('resources_id').references('id').inTable('resources');
          table.integer('users_id').references('id').inTable("users");
        })
        .createTable('likes', function (table) {
          table.increments();
          table.integer('users_id').references('id').inTable("users");
          table.integer('resources_id').references('id').inTable('resources');
        });
};

exports.down = function(knex, Promise) {

  return knex.schema.dropTable('likes')
        .dropTable('ratings')
        .dropTable('comments')
        .dropTable('resourceTags')
        .dropTable('tags')
        .dropTable('resources')
        .table('users', function (table) {
            table.dropColumn('password');
          });
};
