require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
mongoose.connect("mongodb+srv://ask:" + process.env.ATLAS_PASS + "@cluster0.pi81t.mongodb.net/nftDB");

const userSchema = new mongoose.Schema({
    address: String,
    username: String
});

const tokenSchema = new mongoose.Schema({
    tokenId: Number,
    likes: {
        type: [String],
        default: []
    },
    views: { type: Number, default: 0}
});

const User = new mongoose.model("user",userSchema);
const Token = new mongoose.model("token",tokenSchema);

app.post("/changeUserName", (req,res) =>{
    const {address,username} = req.body;

    User.findOne({ address: address}, (err,user) => {
         if(err){
            res.send({success: false});
         }else if(user === null){
            const newUser = new User({
                address: address,
                username: username
            });
            newUser.save();
            res.send({success: true});
         }else{
            user.username = username;
            user.save();
            res.send({success: true});
         }
    })
});

app.post("/user", (req,res) => {
    const address = req.body.address;
    User.findOne({address: address}, (err,user) => {
         if(err){
            res.send({ success: false });
         }else{
            if(user == null) res.send({ success: false});
            else res.send({ success: true, username: user.username});
         }
    });
});

app.post("/newToken", (req,res) => {
    const tokenId = req.body.tokenId;
    const newToken = new Token({
        tokenId: tokenId,
    });
    newToken.save();
    res.send({success: true});
});

app.post("/token", (req,res) => {
    const tokenId = req.body.tokenId;
    const userAddress = req.body.address;

    Token.findOne({tokenId: tokenId}, (err,token) => {
          
        if(err || token === null){
            res.send({success: false});
        }else{
            let user = [];
            if(token.likes.length != 0) user = token.likes.filter( addy => (addy === userAddress));
            let liked = true;
            if(user.length === 0) liked = false;
            res.send({success: true, token: token,liked: liked});
        }
    });
});

app.post("/increaseLikes", (req,res) => {
    const userAddress = req.body.address;
    const tokenId = req.body.tokenId;

    Token.findOne({tokenId: tokenId}, (err,token) => {
        if(err){
            res.send({success: false});
        }else{
            if(token === null){
                res.send({success: false});
            }else{
                const user = token.likes.filter( address => (address === userAddress) );
                if(user.length === 0){
                    token.likes.push(userAddress);
                    token.save();
                    res.send({success: true, likesCount: token.likes.length});
                }else{
                    const newArr = token.likes.filter( address => (address != userAddress));
                    token.likes = newArr;
                    token.save();
                    res.send({success: true, likesCount: token.likes.length});
                }
            }
        }
    });
});


app.post("/increaseViews", (req,res) => {
    const tokenId = req.body.tokenId;
    Token.findOne({ tokenId: tokenId }, (err,token) => {
          if(err || token === null){
             res.send({ success: false });
          }else{
             token.views++;
             token.save();
             res.send({sucess: true, views: token.views});
          }
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});


// Note: Used post requests for all the routes as axios doesn't allow sending data along with get request