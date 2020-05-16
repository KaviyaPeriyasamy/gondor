'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const pascalcase = require('pascalcase');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/db.js')[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

fs.readdirSync(
  path.join(process.env.API_DIR || path.resolve(__dirname, '..'), 'models'),
).forEach((file) => {
  if (
    file.indexOf('.') === 0 ||
    file === 'index.js' ||
    file.slice(-3) !== '.js'
  )
    return;

  const model = sequelize['import'](
    path.join(
      process.env.API_DIR || path.resolve(__dirname, '..'),
      'models',
      file,
    ),
  );
  db[pascalcase(model.name)] = model;
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
