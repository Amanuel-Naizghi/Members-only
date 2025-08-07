const queries = require('../db/queries');

async function postAddUser(req,res){
    const data = req.body;
    queries.addUser(data);
    res.redirect('/');
}

module.exports = {postAddUser};