/* CONNECT MYSQL DATABASE */

const Mysqli = require("mysqli");

let conn = new Mysqli({
    host:"localhost",
    post:3000,
    user:"root",
    passwd:'',
    db:"mhm_depot",
})

let db = conn.emit(false, "");

//get the database and export it
module.exports = {
    database: db,
};