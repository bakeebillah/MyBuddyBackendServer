"use strict";

const userModel = require('../models/user');
const jsonWebToken = require('jsonwebtoken');
const config = require('../configaration');
const bcrypt = require('bcrypt');
var mongoose = require('mongoose');

const buddySearch = (req, res) => {
    if (!req.body.searchText) {
        return res.status(400).json({status: 'error', message: 'There is no text'});
    }


    //return res.status(200).json({status:'OK',message:'you sent '+req.body.searchText});

    const item = req.body.searchText;

    var itemText = {
        $or: [{userName: {$regex: '^' + item, $options: '$i'}}, {
            mobileNumber: {
                $regex: '^' + item,
                $options: '$i'
            }
        }, {mobileNumber: {$regex: '^' + item, $options: '$i'}}, {address: {$regex: '^' + item, $options: '$i'}},
            {city: {$regex: '^' + item, $options: '$i'}}, {
                country: {
                    $regex: '^' + item,
                    $options: '$i'
                }
            }, {gender: {$regex: '^' + item, $options: '$i'}}, {
                email: {
                    $regex: '^' + item,
                    $options: '$i'
                }
            }, {lastName: {$regex: '^' + item, $options: '$i'}},
            {firstName: {$regex: '^' + item, $options: '$i'}}]
    };


    var selectText = 'userName firstName lastName country city gender mobileNumber';


    //return res.status(200).json({status:'OK',message:JSON.stringify(itemText2)});
  var query =  userModel.find(itemText);
    query.select(selectText);

       query .and([{userType:'buddy'}]);

    if(req.body.filterCity)
    {   query .and([{city: req.body.filterCity}]);}

    if(req.body.filterCountry)
    {   query .and([{country: req.body.filterCountry}]);}

    if(req.body.filterGender)
    {   query .and([{gender: req.body.filterGender}]);}

    if(req.body.filterLanguage)
    {   query .and([{'knownLanguage': req.body.filterLanguage}]);}

    if(req.body.filterHobby)
    {   query .and([{hobby: req.body.filterHobby}]);}

    query .then(buddy => {

            if (!buddy) return res.status(404).json({
                status: 'error',
                message: `Buddy not found`
            });

            if (buddy.length === 0) return res.status(404).json({
                status: 'error',
                message: `Buddy not found`
            });

            res.status(200).json(buddy)

        })
    query.catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
    query .exec();
};


module.exports = {
    buddySearch

};