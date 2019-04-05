// Manage cohorts (id, name)
const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile').development;

const db = knex(knexConfig);

const server = express();

server.use(helmet());
server.use(express.json());

// 
// list all cohorts
server.get('/api/cohorts', async (req, res) => {
    // get the cohorts from the database
    try {
      const cohorts = await db('cohorts'); // all the records from the table
      res.status(200).json(cohorts);
    } catch (error) {
      res.status(500).json(error);
    }
  });
  
  // list a role by id
  server.get('/api/cohorts/:id', async (req, res) => {
    // get the cohorts from the database
    try {
      const role = await db('cohorts')
        .where({ id: req.params.id })
        .first();
      res.status(200).json(role);
    } catch (error) {
      res.status(500).json(error);
    }
  });
  
  const errors = {
    '19': 'Another record with that value exists',
  };
  
  // create cohorts
  server.post('/api/cohorts', async (req, res) => {
    try {
      const [id] = await db('cohorts').insert(req.body);
  
      const role = await db('cohorts')
        .where({ id })
        .first();
  
      res.status(201).json(role);
    } catch (error) {
      const message = errors[error.errno] || 'We ran into an error';
      res.status(500).json({ message, error });
    }
  });
  // update cohorts
  server.put('/api/cohorts/:id', async (req, res) => {
    try {
      const count = await db('cohorts')
        .where({ id: req.params.id })
        .update(req.body);
  
      if (count > 0) {
        const role = await db('cohorts')
          .where({ id: req.params.id })
          .first();
  
        res.status(200).json(role);
      } else {
        res.status(404).json({ message: 'Records not found' });
      }
    } catch (error) {}
  });

// /api/cohorts/:id/students` returns all students for the cohort with the specified `id`.
server.get("api/cohorts/:id/students", async (req, res) => {
    try {
      const students = await db("students").where({ cohort_id: req.params.id });
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json(error);
    }
  });
  
  // remove cohorts (inactivate the role)
  server.delete('/api/cohorts/:id', async (req, res) => {
    try {
      const count = await db('cohorts')
        .where({ id: req.params.id })
        .del();
  
      if (count > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: 'Records not found' });
      }
    } catch (error) {}
  });
  
// 
const port = process.env.PORT || 9000;
server.listen(port, () =>
  console.log(`\n** API running on http://localhost:${port} **\n`)
);
