
/*
   GET /api/login/sayHello
   says hello to the world! 
*/
function sayHello(req, res) {
    res.send({ hello: "Hello World" });
}

/*
   GET /api/login/sayGoodbye
   says goodbye to the world!
*/
function sayGoodbye(req, res) {
    res.send("GoodBye!");
}

module.exports = {
    sayHello: sayHello,
    sayGoodbye: sayGoodbye
}