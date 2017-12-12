const express = require('express');
const hbs= require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname+'/views/partials');
app.set('view engine', 'hbs');

//reg. to middlewares
app.use( (req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFileSync('server.log', log + "\n", (err) => {
        if (err){
            console.log('Unable to write log the report');
        }
    });
    next(); //its like break or return to close middleware
});

//middleware for stoping website - maintenance
/*
app.use((req, res, next) => {
    res.render('maintanance', {
        pageTitle: 'Maintanance page'
    });
});*/

//app.use is used to register a middleware - for static web site
app.use(express.static(__dirname + '/public'));

//registering a function globally which can be directly used anywhere in hbs page directly by its name, similarly like define() in php
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

//helper with argv.
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (request, response) => {
    //response.send('<h1>Hello Express..!</h1>'); // Content-Type:text/html
    //response.send({ name: 'Lohith CB', age: 25}); // Content-Type:application/json
    response.render('home', {
        pageTitle: 'Home page',
        //currentYear: new Date().getFullYear(),
        message: 'Welcome to the U..!'
    });
});

app.get('/about', (req, res) => {
    //res.send('About page'); //sending response
    res.render('about', {
        pageTitle: 'About page',
        //currentYear: new Date().getFullYear()
    }); //rendering a page content, posting data to it
});

app.get('/bad', (req, res) => {
    res.send({error: true, message:'This is very bad request'});
});

app.listen(3000, () => {
    console.log('Server is up and running');
});