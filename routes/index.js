const express = require('express');
const app = express.Router();
const passport = require('passport');
const Members = require('../models/Members');
const Movies = require('../models/Movies');
const Audios = require('../models/Audios');
const genMemberId = require('../utils/genMemberId');
const genCoupon = require('../utils/genCoupon');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { ensureUserIsAuthenticated } = require('../config/auth');
const Reservations = require('../models/Reservations');


app.get('/', async(req, res)=>{
    const movies = await Movies.find({ }).sort({ date_time: -1 }).limit(4);
    res.render('index',{
        title: 'Hompage - CinemaHub',
        movies,
        success: req.flash('success'),
        error: req.flash('error')
    });
});

app.get('/login', (req, res)=>{
    res.render('login',{
        title: 'Sign In',
        success: req.flash('success'),
        error: req.flash('error')
    });
});

app.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/view-movies',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

app.get('/register', (req, res)=>{
    res.render('register',{
        title: 'SignUp',
        success: req.flash('success'),
        error: req.flash('error')
    });
});

app.post('/register', async(req, res)=>{
    const { fullname, email, password } = req.body;

    let findMember = await Members.findOne({ email }).exec();
    console.log(findMember);
    if(findMember){
        req.flash('error', 'Email Already Exist');
        return res.redirect('/register');
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const member = new Members({
        memberID: `ch${genMemberId(5)}`,
        fullname,
        email,
        password: hash,
    });

    member.save();

    req.flash('success', 'Account Successfully Created');
    res.redirect('/login');
});

app.get('/view-movies', ensureUserIsAuthenticated, async(req, res)=>{
    const movies = await Movies.find({ }).sort({ createdAt: -1 }).exec();
    res.render('view-movies', {
        title: 'Movies',
        movies,
        user: req.user,
        success: req.flash('success'),
        error: req.flash('error')
    })
});

app.get('/movie/:movieID', ensureUserIsAuthenticated, async(req, res)=>{
    const movie = await Movies.findOne({ movieID: req.params.movieID }).exec();
    res.render('movie-details', {
        title: `Movie Details`,
        movie,
        user: req.user,
        success: req.flash('success'),
        error: req.flash('error')
    })
});

app.post('/movie/:movieID', ensureUserIsAuthenticated, (req, res)=>{
    const { showingTime } = req.body;
    const ticketID = `ch${genCoupon(7)}`;
    const reservation = new Reservations({
        ticketID,
        movieID: req.params.movieID,
        memberID: req.user.memberID,
        showingDate: showingTime.split('/')[0].split('-').reverse().join('/'),
        showingTime: showingTime.split('/')[1],
        showingHall: showingTime.split('/')[2],
        date: new Date().getTime()
    })

    reservation.save();
    req.flash('success','Reservation Booked');
    res.redirect('/reservation/'+ticketID);
});

app.get('/music', ensureUserIsAuthenticated, async(req, res)=>{
    const audios = await Audios.find({}).sort({ createdAt: -1 }).limit(10).exec();
    res.render('music', {
        title: 'Music Gallery',
        audios,
        user: req.user,
        success: req.flash('success'),
        error: req.flash('error')
    })
});

app.get('/add-song', ensureUserIsAuthenticated, (req, res)=>{
    if(!fs.existsSync(path.resolve(__dirname,'../public/audio'))){
        fs.mkdirSync(path.resolve(__dirname,'../public/audio'));
    }
    res.render('add-song', {
        title: 'Add Song',
        user: req.user,
        filepond: true,
    })
})

app.post('/add-song', ensureUserIsAuthenticated, (req, res)=>{
    let poster = ['36NG','tooX3','naijaloaded','illuminaija'];
    let { audio, audioPoster } = req.body;
    let audioID = `song-${genMemberId(5)}`;
    audio = JSON.parse(audio);
    const buffer = Buffer.from(audio.data, "base64");
    if(!fs.existsSync(path.resolve(__dirname,'../public/audio'))){
        fs.mkdirSync(path.resolve(__dirname,'../public/audio'));
    }
    fs.writeFileSync(path.resolve(__dirname,'../public/audio/', audio.name.replace(/_/g,' ')), buffer);

    if(audioPoster){
        audioPoster = JSON.parse(audioPoster);
        const buffer = Buffer.from(audioPoster.data, "base64");
        if(!fs.existsSync(path.resolve(__dirname,'../public/img/music'))){
            fs.mkdirSync(path.resolve(__dirname,'../public/img/music'));
        }
        fs.writeFileSync(path.resolve(__dirname,'../public/img/music/', `${audioID}.jpg`), buffer);

        audioPoster = `${audioID}`;
    } else{
        audioPoster = poster[Math.floor(Math.random() * poster.length)];
    }

    const audios = new Audios({
        audioID,
        audioPoster,
        audioTitle: audio.name.replace(/_/g,' '),
        audioSize: audio.size,
        audioType: audio.type
    })

    audios.save();
    req.flash('success','Audio Successfully Uploaded')
    res.redirect(301, '/music')
})

app.get('/upload-movie', ensureUserIsAuthenticated, (req, res)=>{
    res.render('add-movie', {
        title: 'Upload Movie',
        filepond: true,
        user: req.user,
        min_date: new Date().toISOString().split('T')[0],
        success: req.flash('success'),
        error: req.flash('error')
    })
});

app.post('/upload-movie', ensureUserIsAuthenticated, (req, res)=>{
    let {
        poster,
        title,
        description,
        duration,
        language,
        genre,
        cast,
        showingTime,
        price
    } = req.body;

    let movieID = `movie-${genMemberId(5)}`;

    poster = JSON.parse(poster);
    const buffer = Buffer.from(poster.data, "base64");
    if(!fs.existsSync(path.resolve(__dirname,'../public/img/movies'))){
        fs.mkdirSync(path.resolve(__dirname,'../public/img/movies'));
    }
    fs.writeFileSync(path.resolve(__dirname,'../public/img/movies/', movieID +'.jpg'), buffer);

    let showingTimeArray = [];
    if(Array.isArray(showingTime.date) == false){
        showingTime.date = showingTime.date.split('-').reverse().join('-');
        showingTimeArray.push(showingTime);
    } else {
        for(i=0; i<showingTime.date.length; i++){
            let showingTimeObject = {};
            showingTimeObject.date = showingTime.date[i].split('-').reverse().join('-');
            showingTimeObject.time = showingTime.time[i];
            showingTimeObject.hall = showingTime.hall[i];
            showingTimeArray.push(showingTimeObject);
        }
    }

    let castArray = [];
    if(Array.isArray(cast.actor) == false){
        castArray.push(cast);
    } else {
        for(i=0; i<cast.actor.length; i++){
            let castObject = {};
            castObject.actor = cast.actor[i];
            castObject.role = cast.role[i];
            castArray.push(castObject);
        }
    }

    // if(Array.isArray(genre) == true){
    //     genre = genre.join(',')
    // }

    const movie = new Movies({
        movieID,
        title,
        description,
        duration,
        language,
        genre,
        cast: castArray,
        showingTime: showingTimeArray,
        price,
        date_time: new Date().getTime()
    })

    movie.save();
    req.flash('success', 'Movie Uploaded')
    res.redirect('/upload-movie')
});

app.get('/reservation/:ticketID', ensureUserIsAuthenticated, async(req, res)=>{
    Reservations.findOne({ ticketID: req.params.ticketID })
    .then(async(reservation)=>{
        const movie = await Movies.findOne({ movieID: reservation.movieID }).exec();
        res.render('reservation', {
            title: `Reservation`,
            reservation,
            movie,
            user: req.user,
            success: req.flash('success'),
            error: req.flash('error')
        })
    })
    .catch(err => console.error(err))
});

app.get('/log-out', (req,res)=>{
    req.logOut();
    req.flash('success','Successfully Logged Out');
    res.redirect('/');
})

module.exports = app;