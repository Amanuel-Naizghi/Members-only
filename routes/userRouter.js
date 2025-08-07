const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get('/',(req,res) => {
    res.render('home');
});

router.get('/register', (req,res) => {
    res.render('register');
});

router.post('/register', userController.postAddUser);

module.exports = router;