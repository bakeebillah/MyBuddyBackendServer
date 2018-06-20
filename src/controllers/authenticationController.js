"use strict";

const userModel =  require('../models/user');
const jsonWebToken = require('jsonwebtoken');
const config = require('../configaration');
const bcrypt = require('bcrypt');


const register =(req,res)=>{
    if (req.body.password !== req.body.passwordConf) {
    return res.status(400).json({
     error:'Bad Request' ,
        message:'Passwords do not match.'
    });

}

if (req.body.email &&
        req.body.username &&
        req.body.password) {

        const user = Object.assign(req.body, {password: bcrypt.hashSync(req.body.password, 8)});
        //use schema.create to insert data into the db
        userModel.create(user)
            .then(user => {
                // if user is registered without errors
                // create a token
                const token = jsonWebToken.sign({ id: user._id, username: user.username }, config.JwtSecret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.status(200).json({
                    token: token,
                    message: "Successfully created your account."
                });
            })
            .catch(error => {
                if(error.code == 11000) {
                    res.status(400).json({
                        error: 'User exists',
                        message: error.message
                    })
                }
                else{
                    res.status(500).json({
                        error: 'Internal server error',
                        message: error.message
                    })
                }
            });

            res.status(200).json({token: token});


        })
        .catch(error => {
            if(error.code == 11000) {
                res.status(400).json({
                    error: 'User exists',
                    message: error.message
                })
            }
            else{
                res.status(500).json({
                    error: 'Internal server error',
                    message: error.message
                })
            }
        });

}// end if
else {

    return res.status(400).json({
        error:'Bad Request' ,
        message:'All fields required.'
    });
} // end else


};

const login = (req,res)=>{

    // Checking blank username
    if(!req.body.username){
        return res.status(400).json({
            error:'Missing Username',
            message: 'The request must contain a username property'
        });
    } // end if - Checking blank username

    // Checking blank password
    if(!req.body.password){
        return res.status(400).json({
            error:'Missing Password',
            message: 'The request must contain a password property'
        });
    }// end if of Checking blank password

    userModel.findOne({username: req.body.username}).exec()
        .then(user => {


            const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
            if (!isPasswordValid) return res.status(401).send({token: null });

            // if user is found and password is valid
            // create a token
            const token = jsonWebToken.sign({ id: user._id, username: user.username }, config.JwtSecret, {
                expiresIn: 86400 // expires in 24 hours
            });

            res.status(200).json({token: token});

        })
        .catch(error => res.status(404).json({
            error: 'User Not Found',
            message: error.message,
        }));

}

const me = (req, res) => {


 

    var ObjectId = require('mongodb').ObjectId;
    var id = req.userId;
    var o_id = new ObjectId(id);

    userModel.find({_id:o_id}).select('username').exec()
        .then(user => {

            if (!user) return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });


            res.status(200).json(user)
        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
};

const logout = (req, res) => {
    res.status(200).send({ token: null });
};

const statustest = (req, res) => {

    if (Object.keys(req.headers).length === 0) return res.status(400).json({
          error: 'Bad Request',
          message: 'The request body is empty'
      });

    res.status(200).json({
        message:'you are still logged in.'


    });
};



module.exports = {
    login,
    register,
    me,
    logout,
    statustest

};