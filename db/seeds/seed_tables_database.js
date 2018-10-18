
exports.seed = async function(knex, Promise) {

  await knex('resources').del();
  return knex('users').del()
    .then(async function () {

      // Inserts seed entries in users
      const users = await Promise.all([
        knex('users').insert({name: 'Kevin', password: 'kevin'}).returning("id"),
        knex('users').insert({name: 'Carlo', password: 'carlo'}).returning("id"),
        knex('users').insert({name: 'Aaron', password: 'aaron' }).returning("id")
      ]);

      const res_id = [];
      const resources = await Promise.all([
        // Inserts seed entries in resources
      knex('resources').insert({title: 'Mount St. Helens', description: 'video of eruption in 1980',
                                          resource_url: 'https://video.nationalgeographic.com/wild/disaster-at-mount-st-helens',
                                          created_at: 10, rating: 5, likes: 3, users_id: users[0][0]}).returning('id')
        .then((response) => {
          res_id.push(response[0]);
          knex('resources').insert({title: 'The Moose', description: 'video of caribou migration',
                                          resource_url: 'https://www.youtube.com/watch?v=r6jcqCm5C1Q&t=29s',
                                          created_at: 5, rating: 5, likes: 2, users_id: users[1][0]}).returning('id')
                .then((response) => {
                  res_id.push(response[0]);
                  knex('resources').insert({title: 'Pumpkins', description: 'the secret lives of pumpkins',
                                                  resource_url: 'http://www.thepumpkingeek.com/id6.html',
                                                  created_at: 2, rating: 5, likes: 5, users_id: users[2][0]}).returning('id')
                  .then((response) => { return res_id.push(response[0])})
                })
        })


      ]);

      const tags = await Promise.all([
        // Inserts seed entries tags
        knex('tags').insert({name: 'volcano'}).returning('id'),
        knex('tags').insert({name: 'caribou'}).returning('id'),
        knex('tags').insert({name: 'pumpkin'}).returning('id'),
        knex('tags').insert({name: 'geology'}).returning('id'),
        knex('tags').insert({name: 'animal'}).returning('id'),
        knex('tags').insert({name: 'plant'}).returning('id')
      ]);

      const resource_tags = await Promise.all([
        // Inserts seed entries in resource_tags
        knex('resource_tags').insert({resources_id:res_id[0], tags_id: tags[0][0]})
        .then (() => {
            knex('resource_tags').insert({resources_id:res_id[1], tags_id: tags[4][0]})
            .then ( () => {
                knex('resource_tags').insert({resources_id:res_id[2], tags_id: tags[5][0]})
                .then (() => {})
            })
        })
      ]);

      const comments = await Promise.all([
        // Inserts seed entries in comments
        knex('comments').insert({comment: 'Absolutely amazing!', users_id:users[1][0], resources_id:res_id[0]}),
        knex('comments').insert({comment: 'WOW', users_id:users[0][0], resources_id:res_id[1]}),
        knex('comments').insert({comment: 'SPOOOOKY', users_id:users[2][0], resources_id:res_id[2]}),
      ]);
    });
};
