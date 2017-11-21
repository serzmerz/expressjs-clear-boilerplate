const passport = require('passport');
const Strategy = require('passport-local');
const crypto = require('crypto');
const db = require('./models');
const User = db.Admin;

const isValidPassword = function(user, password) {
    password = crypto.createHmac('sha256', password)
        .update('hack this please')
        .digest('hex');
    return password === user.password;
};

passport.use(new Strategy(
    function(username, password, done) {
        User.findOne({ where: { login: username } }).then(user => {
            if (! user) {
                return done(null, false, {
                    message: 'Login does not exist'
                });
            }
            if (! isValidPassword(user, password)) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return done(null, user);
        }).catch(function(err) {
            console.log('Error:', err);
            return done(null, false, {
                message: 'Something went wrong with your Signin'
            });
        });
    }));

module.exports = passport;
