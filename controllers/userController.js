const queries = require('../db/queries');
const {body,validationResult} = require("express-validator");


const lengthErr1 = "length must be more than 8 characters";
const lengthErr2 = "length must be more than 4 characters";

const validateUser = [
    body("password").trim()
    .isLength({min:8}).withMessage(`Password ${lengthErr1}`),

    body("confirmPassword")
    .custom((value,{req}) =>{
        if(value !== req.body.password){
            throw new Error("Passwords do not match");
        }
        return true;
    }),

    body("userName")
    .isLength({min:4,max:10}).withMessage(`User name ${lengthErr2}`),

    body("lastName")
    .custom((value,{req}) =>{
        if(value === req.body.firstName){
            throw new Error("First and last names could not be the same");
        }
        return true;
    })
];

exports.postAddUser = [
    validateUser,
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.render('register',{
                errors:errors.array(),
                old:req.body
            });
        }
        const data = req.body;
        await queries.addUser(data);
        res.redirect('/');
    }
]
