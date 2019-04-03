
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('students').del()
    .then(function () {
      // Inserts seed entries
      return knex('students').insert([
        {cohort_id:1, name: 'Lisa'},
        {cohort_id:2, name:'Anna'},
        {cohort_id:3, name:'Taira'},
      ]);
    });
};
