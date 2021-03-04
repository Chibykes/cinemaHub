const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const Members = require('../models/Members');

module.exports = (passport) => {
    /**
     * This passport authentication is for User
     */
    passport.use(
        new LocalStrategy({ usernameField: 'email', passwordField:'password', passReqToCallback: true }, (req, email, password, done)=>{
            //Check if user already exists
            Members.findOne({ $or: [{email}, {memberID: email}] })
                .then(member => {
                    //if there is no member, return error
                    if(!member){
                        return done(null, false, 'Email/Member ID does not exist');
                    }
                    //if member exist, compare password
                    bcrypt.compare(password, member.password)
                        .then(async(isMatch) => {
                            //if the password entered matches with what is
                            // in the database, return the member details
                            if(isMatch){
                                req.flash('success','Login Successful');
                                return done(null, member)
                            }
                            //if the password entered does not matches with what is
                            // in the database, return error
                            return done(null, false, 'Password Incorrect');
                        })
                        .catch(err => console.error(err));
                })
                .catch(err => console.error(err));

        })
    );


    passport.serializeUser((member, done)=>{
        return done(null, member.id);
    });

    passport.deserializeUser((id, done)=>{
        Members.findById({ _id: id }, (err, member)=>{
            return done(err, member);
        })
    });
}