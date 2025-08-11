const express = require("express");
const passport = require("passport");
const router = express.Router();
const userController = require("../controllers/userController");

router.get('/',(req,res) => {
    res.render('home');
});

router.get('/register', (req,res) => {
    res.render('register');
});

router.post('/register', userController.postAddUser);

router.get('/login', (req,res) => {
    res.render('login');
});

router.post('/login', 
            passport.authenticate("local",{
                successRedirect:"/",
                failureRedirect:"/login",
                failureFlash: "Wrong user name or password"
            })
);


module.exports = router;