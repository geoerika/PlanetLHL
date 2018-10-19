//generally it alters most of the database columns to be not null

exports.up = function(knex, Promise) {

  return knex.schema

        //creates a uuid 'token' column in 'users' table
        .table('users', function (t) {
          t.uuid('token');
        })

        .alterTable('users', function(t) {
          t.string('name').notNullable().alter();
          // sets 'user' 'name' as unique
          t.unique('name');
        })

        .alterTable('resources', function (t) {
          t.string('title').notNullable().alter();
          t.text('description').notNullable().alter();
          t.string('resource_url').notNullable().alter();
          //defines 'created_at' as bigInteger
          t.bigInteger('created_at').notNullable().alter();
          t.integer('users_id').notNullable().alter();
        })

        .alterTable('tags', function (t) {
          t.string('name').notNullable().alter();
          // sets 'tags' 'name' as unique
          t.unique('name');
        })

        .alterTable('resource_tags', function (t) {
          t.integer('resources_id').notNullable().alter();
          t.integer('tags_id').notNullable().alter();
        })

        .alterTable('comments', function (t) {
          t.text('comment').notNullable().alter();
          t.integer('users_id').notNullable().alter();
          t.integer('resources_id').notNullable().alter();
        })

        .alterTable('ratings', function (t) {
          t.integer('rating').notNullable().alter();
          t.integer('resources_id').notNullable().alter();
          t.integer('users_id').notNullable().alter();
        })

        .alterTable('likes', function (t) {
          t.integer('users_id').notNullable().alter();
          t.integer('resources_id').notNullable().alter();
        });
};

exports.down = function(knex, Promise) {

  return knex.schema

        .alterTable('likes', function (t) {
          t.integer('resources_id').nullable().alter();
          t.integer('users_id').nullable().alter();
        })

        .alterTable('ratings', function (t) {
          t.integer('users_id').nullable().alter();
          t.integer('resources_id').nullable().alter();
          t.integer('rating').nullable().alter();
        })

        .alterTable('ratings', function (t) {
          t.integer('users_id').nullable().alter();
          t.integer('resources_id').nullable().alter();
          t.integer('rating').nullable().alter();
        })

        .alterTable('comments', function (t) {
          t.integer('resources_id').nullable().alter();
          t.integer('users_id').nullable().alter();
          t.text('comment').nullable().alter();
        })

        .alterTable('resource_tags', function (t) {
          t.integer('tags_id').nullable().alter();
          t.integer('resources_id').nullable().alter();
        })

        .alterTable('tags', function (t) {
          t.dropUnique('name');
          t.string('name').nullable().alter();
        })

        .alterTable('resources', function (t) {
          t.integer('users_id').nullable().alter();
          t.integer('created_at').nullable().alter();
          t.string('resource_url').nullable().alter();
          t.text('description').nullable().alter();
          t.string('title').nullable().alter();
        })

        .alterTable('users', function(t) {
          t.dropUnique('name');
          t.string('name').nullable().alter();
        })

        .table('users', function (t) {
          t.dropColumn('token');
        });
};
