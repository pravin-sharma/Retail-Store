const envfile = require('dotenv').config()
const {Sequelize} = require('sequelize');

const dbname = process.env.DB_NAME;
const dbuser = process.env.DB_USER;
const dbpassword = process.env.DB_PASS;
const dbhost = process.env.DB_HOST;

const sequelize = new Sequelize(dbname, dbuser , dbpassword,{
    dialect: 'mysql',
    host: dbhost
})

module.exports = sequelize;