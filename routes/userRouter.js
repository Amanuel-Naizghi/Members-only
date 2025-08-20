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
//User authentication is done after user try to login
router.post('/login', 
            passport.authenticate("local",{
                failureRedirect:"/login",
                failureFlash: "Wrong user name or password"//Used for showing message if the user inputs are not correct
            }),
            (req,res) => {
                res.redirect(`/user/${req.user.id}`);
            }
);

router.get('/user/:id', ensureAuthenticated, async (req,res) =>{
    //Is used when user try to by pass the authentication part by typing the url like user/1
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
    if(secretCode){//Redirect the page to the admin page if the user knows the secret code
        res.redirect(`/admin/${req.user.id}`);
    }
    else{
        res.render(`checkAdmin`,{error:"Incorrect secret code"});
    }
});

router.get('/admin/:id', ensureAuthenticated, async (req,res) =>{
    const {rows} = await pool.query("SELECT username, firstname, lastname FROM users WHERE id = $1", [req.user.id]);
    const data = await userController.getAllMessage();
    if(req.params.id != req.user.id){
        return res.status(403).send("You cannot view another user's page.");
    }
    res.render(`admin`,{user:rows[0].username,
        data:data
    });
});

router.post('/:id/delete', ensureAuthenticated, async (req,res) => {
    await userController.deleteMessage(req.params.id);
    res.redirect(`/admin/${req.user.id}`);
})


module.exports = router;