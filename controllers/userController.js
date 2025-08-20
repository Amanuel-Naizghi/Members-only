const queries = require('../db/queries');
const {body,validationResult} = require("express-validator");


const lengthErr1 = "length must be more than 8 characters";
const lengthErr2 = "length must be more than 4 characters";

const validateUser = [
    body("password").trim()
    .isLength({min:8}).withMessage(`Password ${lengthErr1}`)
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage("Password must contain at least one letter, one number, and one special character")
    .escape(),

    body("confirmPassword").trim()
    .custom((value,{req}) =>{
        if(value !== req.body.password){
            throw new Error("Passwords do not match");
        }
        return true;
    }).escape(),

    body("userName").trim().toLowerCase()
    .isLength({min:4,max:10}).withMessage(`User name ${lengthErr2}`)
    .custom(async (value)=>{ //value is the same as req.body.userName
        const user = await queries.getUser(value);
        if(user){
            throw new Error("User already exists");
        }
    }).escape(),

    body("lastName").trim()
    .custom((value,{req}) =>{
        if(value === req.body.firstName){
            throw new Error("First and last names could not be the same");
        }
        return true;
    }).escape(),

    body("firstName").trim().escape(),
];

exports.postAddUser = [
    validateUser,
    async (req,res) => {
        const errors = validationResult(req);//It goes through validateUser requirements and store errors if available
        if(!errors.isEmpty()){
            return res.render('register',{
                errors:errors.array(),//Sends all validation errors as an array and display it in the register page
                old:req.body//Used for putting the old inputs into where they were for a better UX
            });
        }
        const data = req.body;
        await queries.addUser(data);//If no error it inserts the data from the input into the db
        res.redirect('/');
    }
];

exports.postMessage = async (data,id) => {
    await queries.addMessage(data,id);
}

exports.getAllMessage = async () => {
    const data = await queries.getAllMessagesWithUsers();

    return data
}

exports.checkSecret = (userInput) => {
    const secret = 'jesus';
    if(userInput.trim().toLowerCase() === secret){//Checks whether the user knows the secret key if yes user will have access to the admin page
        return true;
    }
    return false;
}

exports.deleteMessage = async (id) => {
    await queries.removeMessage(id);
}


