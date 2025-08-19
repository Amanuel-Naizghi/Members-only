const express = require("express");
const passport = require("passport");
const router = express.Router();
const userController = require("../controllers/userController");
const pool = require('../db/pool');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

router.get('/',async (req,res) => {
    const data = await userController.getAllMessage();
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

router.get('/createPost',ensureAuthenticated,(req,res) => {
    res.render("createPost");
});

router.post('/createPost',ensureAuthenticated, async (req,res) =>{
    const data = req.body;
    await userController.postMessage(data,req.user.id);
   res.redirect(`/user/${req.user.id}`);
});

router.get('/checkAdmin',ensureAuthenticated,(req,res) => {
    res.render("checkAdmin");
});

router.post('/checkAdmin',ensureAuthenticated, async (req,res) => {
    const secretCode = userController.checkSecret(req.body.secret);
    if(secretCode){
        const {rows} = await pool.query("SELECT username, firstname, lastname FROM users WHERE id = $1", [req.user.id]);
        const data = await userController.getAllMessage();
        res.render(`admin`,{user:rows[0].username,
                                              data:data
        });
    }
    else{
        res.render(`checkAdmin`,{error:"Incorrect secret code"});
    }
});


module.exports = router;