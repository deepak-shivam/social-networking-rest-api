const express = require('express');
const router = express.Router()
const passport = require('passport');
const {fetchUserFromGoogle} = require('../controllers/oauthController')
const {fetchUserFromFacebook} = require('../controllers/oauthController')

router.get('/google', passport.authenticate('google', { scope: ['profile','email'] , session: false }))


router.get('/google/redirect', passport.authenticate('google'), fetchUserFromGoogle)

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] , session: false }))


router.get('/facebook/redirect', passport.authenticate('facebook', { failureRedirect: "http://localhost:1234/#login", 
 session: false }), fetchUserFromFacebook)


module.exports = router