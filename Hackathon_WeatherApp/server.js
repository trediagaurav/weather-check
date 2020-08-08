const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const pws = require('p4ssw0rd');
const cors = require('cors');
const DB = require('./modules/db');

const app = express();
app.use(express.static(__dirname + '/public'))

app.set('port', 3000);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.use(cookieParser());

app.use(
  session({
    key: 'user_sid',
    secret: 'some_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 300000
    }
  })
);

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});


const sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
      res.redirect('/dashboard');
  } else {
      next();
  }
};

app.get('/', sessionChecker, (req, res) => {
    res.redirect('/signup');
});

app.route('/signup')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/signup.html');
    })
    .post((req, res) => {
        DB.createUser(req.body)
        .then(user => {
            req.session.user = user[0];
            res.redirect('/dashboard');
        })
        .catch(error => {
            res.redirect('/signup');
        });
    });


app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/login.html');
    })
    .post((req, res) => {
        const {username, password} = req.body;
        DB.findUser(username)
        .then( user => {
            if (!user) {
                res.redirect('/login');
            } else if (!pws.check(password,user[0].password, 10)) {
                
                res.redirect('/login');
            } else {
                req.session.user = user[0];
                res.redirect('/dashboard');
            }
        })
        .catch(error => {
            console.log(error)
          res.redirect('/login');
        });
    });


app.route('/dashboard')
  .get( (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/public/dashboard.html');
    } else {
        res.redirect('/login');
    }
  })
  .post( (req, res) => {

  });


app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

app.get('/getUserList', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
      console.log(req.session.user.id);
      console.log(req.cookies);
      res.send({user:req.session.user})
      //res.redirect('/');
  } else {
      res.redirect('/login');
  }
});


app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});


app.listen(app.get('port'), () => {
  console.log(`App started on port ${app.get('port')}`)
});
