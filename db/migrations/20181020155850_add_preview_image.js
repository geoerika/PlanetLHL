exports.up = function(knex, Promise) {

  return knex.schema

        //creates an 'image_url' column for the 'resources' table
        .table('resources', function (t) {
          t.string('image_url');
        });
};


exports.down = function(knex, Promise) {

  return knex.schema
        //removes the 'image_url' column from 'resources' table
        .table('resources', function (t) {
          t.dropColumn('image_url');
        });
};
