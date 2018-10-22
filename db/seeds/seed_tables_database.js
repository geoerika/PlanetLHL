
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

      const resources = await Promise.all([
        // Inserts seed entries in resources
        knex('resources').insert({title: 'Mount St. Helens', description: 'video of eruption in 1980',
                                          resource_url: 'https://video.nationalgeographic.com/wild/disaster-at-mount-st-helens',
                                          created_at: 10, rating: 0, likes: 0, users_id: users[0][0], image_url:'http://pmdvod.nationalgeographic.com/NG_Video/112/771/239818307887_1080i_2997_DisasterAtMountStHelens_DMS_640x360_249225795661.jpg'}),
        knex('resources').insert({title: 'The Caribou migration', description: 'video of caribou migration',
                                          resource_url: 'https://www.youtube.com/watch?v=r6jcqCm5C1Q&t=29s',
                                          created_at: 5, rating: 0, likes: 0, users_id: users[1][0], image_url:'https://i.ytimg.com/vi/r6jcqCm5C1Q/maxresdefault.jpg'}),
        knex('resources').insert({title: 'Pumpkins', description: 'the secret lives of pumpkins',
                                          resource_url: 'http://www.thepumpkingeek.com/id6.html',
                                          created_at: 2, rating: 0, likes: 0, users_id: users[2][0], image_url:'http://www.thepumpkingeek.com/sitebuildercontent/sitebuilderpictures/.pond/Vader10.jpg.w300h308.jpg'}),
      ]);
    });
};
