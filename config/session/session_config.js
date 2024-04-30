const sessionConfig = {
    secret : "암호화 키",
    resave : true,
    // saveUninitialized : false,
    saveUninitialized : true,
    cookie: {maxAge:1800000}
}
module.exports = { sessionConfig };