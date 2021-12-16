const sequelize = require('../config/connection');

const userData = require('./userData');
const postData = require('./postData');
const commentData = require('./commentData');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });
    console.log('\n-----DATABASE SYNCED-----\n');
    await userData();
    console.log('\n-----USER DATA SYNCED-----\n');
    await postData();
    console.log('\n-----POST DATA SYNCED-----\n');
    await commentData();
    console.log('\n-----COMMENT DATA SYNCED-----\n');
    process.exit(0);
};

seedDatabase();