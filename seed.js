'use strict'

const util = require('util');
const async = require('async');
const _ = require('lodash');
const casual = require('casual');
const faker = require('faker');
const Promise = require('bluebird');

const knex = require('knex')(require('./knexfile')['development']);
const knex_cleaner = require('knex-cleaner');
const Model = require('objection').Model;
Model.knex(knex);

const Team = require('./team');
const User = require('./user');

knex.raw('select 1+1 as result').then(function () {
  // there is a valid connection in the pool
    console.log('knex successful connection to pg');

    dropDb()
    .then(startSeed)
    .catch(handleSeedError);
});


function startSeed() {
    console.log('starting seed...');

    async.auto({

        team: createTeam,
        user: createUser

    }, (err, results) => {
        if (err) return handleSeedError(err);
        handleSeedSuccess();
    });
}

function dropDb() {
    console.log('dropping db');
    return new Promise((resolve, reject) => {
        knex_cleaner.clean(knex).then(function () {
            resolve();
        });
    });
}

function createTeam(callback) {
    console.log('creating objection example team');

    Team
    .query()
    .insert({ name: 'objection' })
    .then(team => {
        callback(null, team);
    })
    .catch(handleSeedError);
}

const createUser = ['team', function createMitchellUser(results, callback) {
    console.log('creating user');

    const user_json = {
        name: 'Steve Johnson',
        password: '1234',
        email: 'steve@stevejohnson.com',
        position: 'node.js dev',
        avatar_url: 'https://stevejohnson.com/avatar.png',
        team: results.team.id
    };

    // const user = User.fromJson(user_json);

    User
    .query()
    .insert(user_json)
    .returning('*')
    .then(user => {
        callback(null, user);
    })
    .catch(handleSeedError);

}];

function handleSeedSuccess() {
    console.log('successfully seeded db');
    process.exit();
}

function handleSeedError(err) {
    console.log('seed error: ' + err);
    process.exit();
}