/**
 * Created by reliance on 2/22/2017.
 */
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var express = require('express');
var app = express();
var db ;

    MongoClient.connect('mongodb://admin:root@ds153669.mlab.com:53669/quick_rent_database',function (err, database) {
        if (err) return console.log(err)
        db = database
        app.listen(3000, function() {
            console.log('listening on 3000')
        })
    }) ;

