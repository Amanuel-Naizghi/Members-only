const express = require("express");
const passport = require("passport");
const router = express.Router();
const userController = require("../controllers/userController");
const queries = require('../db/queries');

router.get('/',async (req,res) => {
    const data = await queries.getAllMessagesWithUsers();
    console.log(data);
    res.render('home',{data:data});
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