const oracledb = require("oracledb");
const dbConfig = require("./db_config");
oracledb.autoCommit = true;
oracledb.outFormat = oracledb.OBJECT;

module.exports=oracledb.getConnection(dbConfig);