//jshint esversion:6
// require modules 
require("dotenv").config();
const bodyParser = require("body-parser")
const express = require("express")
const ejs = require("ejs");
const encrypt = require("mongoose-encryption")

const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]})

const User = new mongoose.model("User", userSchema);

// create a new app instance using express
const app = express();

// set up view engine to use ejs templating
app.set('view engine', 'ejs')

// use body parser to get our request
app.use(bodyParser.urlencoded({extended: true}));

// use the public folder for static files (images, css, etc)
app.use(express.static("public"));


app.get("/", function(req,res){
    res.render("home")
});

app.route("/login")

    .get(function(req,res){
        res.render("login")
    })

    .post(function(req,res){
        const username = req.body.username
        const password = req.body.password

        User.findOne({email: username}, function (err,foundUser){
            if (err){
                console.log(err)
            }
            else{
                console.log("user found", "username is ", foundUser.email, "password is ", foundUser.password)
                if (foundUser){
                    if (foundUser.password === password){
                        res.render("secrets")
                    }
                    console.log("invalid user")
                }
              
            }

        });
    });

app.route("/register")
    .get(function(req,res){
        res.render("register")
    })

    .post(function(req, res){
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });
        console.log("post request received ")
         
        newUser.save(function(err){
            if (err){
                console.log(err)
            }else{
                res.render("secrets.ejs")
            }
        })
    });

app.listen("3000", function(){
    console.log ("server is running on port 3000")
})