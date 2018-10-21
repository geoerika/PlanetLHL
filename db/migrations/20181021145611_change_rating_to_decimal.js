

exports.up = function(knex, Promise) {

  return knex.schema

        .alterTable('resources', function (t) {
          t.decimal('rating').alter();
        })
};

exports.down = function(knex, Promise) {

  return knex.schema

        .alterTable('resources', function (t) {
          t.integer('rating').alter();
        })
};
