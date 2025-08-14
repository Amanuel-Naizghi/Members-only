const express = require("express");
const passport = require("passport");
const router = express.Router();
const userController = require("../controllers/userController");
const pool = require('../db/pool');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

router.get('/',async (req,res) => {
    const data = await userController.getAllMessage();
    console.log(data);
    res.render('home',{data:data,
                       page:'Home'
    });
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
                failureRedirect:"/login",
                failureFlash: "Wrong user name or password"
            }),
            (req,res) => {
                res.redirect(`/user/${req.user.id}`);
            }
);

router.get('/user/:id', ensureAuthenticated, async (req,res) =>{
    if(req.params.id != req.user.id){
        return res.status(403).send("You cannot view another user's page.");
    }
    const {rows} = await pool.query("SELECT username, firstname, lastname FROM users WHERE id = $1", [req.user.id]);
    
    if(rows.length === 0) {
        return res.status(403).send("User not found");
    }

    const data = await userController.getAllMessage();

    res.render("user",{userData:rows[0],
                       user:rows[0].username,
                       data:data
    });
});


module.exports = router;