const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const logger = require("morgan");
const cookie = require("cookie");
const mysql = require("mysql");
// Database connection
let db;
// Load Dotenv configs
require('dotenv').config();

const app = express();

// Have express use these middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger("dev"));

// Serve built files
app.use(express.static(path.join(__dirname, 'reactapp/build'), {index: false}));

const router = express.Router();
/**
 * GET request for login. Used at the start to see if session is still valid based on cookies and to send them their public/private key & associated user info
 */
router.get("/login", (req, res) => {
    // Send unauthorized request, indicating they have to login!
    if(!req.headers || !req.headers.cookie) {
        res.sendStatus(401);
        return;
    }
    const cookies = cookie.parse(req.headers.cookie);
    // If our cookies that we want set aren't set, then they're unauthorized
    if(!cookies || !cookies.user_id || cookies.user_id === undefined) {
        console.log("Cookies weren't present, unauthorized.");
        res.sendStatus(401);
        return;
    }
    // MySQL fetch data and send back in a JSON request
    if(!db)
        res.status(500).send('SQL connection was not established');
    else
    {
        db.query(`SELECT * FROM \`accounts\` WHERE \`user_id\`='${cookies.user_id}'`, (err, result) =>
        {
            if(err) {
                console.log(err);
                res.status(500).send(err);
            }
            else
            {
                if(result.length === 0)
                    res.sendStatus(401);
                else {
                    console.log("ok");
                    console.log(result);
                    res.cookie('user_id', result[0].user_id);
                    res.status(200).json({user_id: result[0].user_id, username: result[0].username});
                }
            }
        });
    }
});
/**
 * POST request for login. Used to try and login
 */
router.post("/login", (req, res) => {
    // Read request body
    // If no body or invalid fields/length then bad request
    if(!req.body)
    {
        res.sendStatus(400);
        return;
    }
    let user = req.body.username;
    let secret = req.body.password;
    // Check if valid, as well as check that there are no additional data in the body..
    if(!user || !secret || Object.keys(req.body).length !== 2)
    {
        res.sendStatus(400);
        return;
    }
    // MySQL request based on this user + secret
    if(!db)
        res.status(500).send('SQL connection was not established');
    else
    {
        db.query(`SELECT * FROM accounts WHERE username='${user}' AND BINARY password='${secret}'`, (err, result) => {
            if(err)
            {
                console.log(err);
                res.status(500).send(err);
            }
            else
            {
                console.log(result);
                if(result.length === 0)
                    res.sendStatus(400);
                else // Send back jsut their user_id that they can use for future requests
                {
                    res.cookie("user_id", result[0].user_id);
                    res.status(200).json({user_id: result[0].user_id, username: user});
                }
            }
        });
    }
});
/**
 * POST request for login/create. Used to create a new login
 */
router.post("/login/create", (req, res) => {
    // Read request body
    if(!req.body)
    {
        res.sendStatus(400);
        return;
    }
    let user = req.body.username;
    let secret = req.body.password;

    if(!user || !secret || Object.keys(req.body).length !== 2)
    {
        res.sendStatus(400);
        return;
    }
    if(!db)
        res.status(500).send('SQL connection was not established');
    else
    {
        // First, find if this user already exists
        // If doesn't exist, we can insert!
        db.query(`SELECT * FROM accounts WHERE username='${user}'`, (err, result) =>
        {
            if(err)
            {
                console.log(err);
                res.status(500).send(err);
            }
            else
            {
                console.log(result);
                if(result.length === 0)
                {
                    // Make another query
                    db.query(`INSERT INTO accounts (username, password) VALUES ('${user}', '${secret}');`, (err2, result2) => {
                        if(err2)
                        {
                            console.log(err2);
                            res.status(500).send(err2);
                        }
                        else
                        {
                            console.log(result2);
                            res.cookie("user_id", result2.insertId);
                            res.status(200).json({user_id: result2.insertId, username: user});
                            // Also set cookies
                        }
                    });
                }
                else
                {
                    res.status(400).send('Account with that username already exists');
                }
            }
        });
    }
    
});
/**
 * To logout
 */
router.get("/logout", (req, res) => {
    if(!req.headers || !req.headers.cookie) {
        res.sendStatus(401);
        return;
    }
    
    const cookies = cookie.parse(req.headers.cookie);

    if(!cookies.user_id) {
        res.sendStatus(401);
        return;
    }

    res.clearCookie('user_id');
    res.sendStatus(200);
})
/**
 * GET request for all addresses under user_id
 */
router.get("/address/:user_id", (req, res) => {
    // Validate
    if(!req.headers || !req.headers.cookie)
    {
        console.log("invalid req");
        res.sendStatus(401);
        return;
    }

    const cookies = cookie.parse(req.headers.cookie);
    if(!cookies.user_id || cookies.user_id !== req.params.user_id)
    {
        console.log("Invalid cookie");
        res.sendStatus(401);
        return;
    }
    if(!db)
    {
        res.status(500).send('MySQL connection was not established');
        return;
    }
    // Else do a SELECT * from wallets & send back
    db.query(`SELECT * FROM wallets WHERE user_id=${cookies.user_id}`, (err, result) => {
        if(err)
        {
            console.log(err);
            res.status(500).json(err);
        }
        else
        {
            res.status(200).json(result);
        }
    });
})
/**
 * POST request, insert new WIF to associate with this user
 */
router.post("/account/:user_id/wif", (req, res) => {
    // Read body

    if(!req.body)
    {
        res.sendStatus(400);
        return;
    }
    let wif = req.body.wif;
    let nick = req.body.nick ? req.body.nick : '';
    if(!wif)
    {
        res.sendStatus(400);
        return;
    }

    if(!db)
    {
        res.status(500).send('MySQL connection was not established');
        return;
    }
    // Make sure there's no dupes by SELECT * FROM where wif= AND user=
    db.query(`SELECT * FROM wallets WHERE user_id=${req.params.user_id} AND wif='${wif}'`, (err, result) => {
        if(err)
        {
            console.log(err);
            res.status(500).json(err);
        }
        else
        {
            // Make sure no results
            if(result.length > 0)
            {
                // Not okay
                res.status(400).send('Address already exists for this user');
            }
            else
            {
                // INSERT INTO
                db.query(`INSERT INTO wallets (user_id, wif, nick) VALUES(${req.params.user_id}, '${wif}', '${nick}')`, (err2, result2) => {
                    if(err2)
                    {
                        console.log(err2);
                        res.status(500).json(err2);
                    }
                    else
                    {
                        console.log(result2);
                        res.status(200).json({user_id: req.params.user_id, wif: wif});
                    }
                })
            }
        }
    });
});
/**
 * PUT request. Update the WIF here
 */
router.put("/account/:user_id/wif/update", (req, res) => {
    // Read request body
    
    // SELECT * FROM WHERE wif=
})
/**
 * Delete request for account/delete. Used to delete a user
 */
router.delete("/account/delete", (req, res) => {

});
// Default request
router.get("*", (req, res) => {
    res.sendStatus(404);
});
// Use our router for any requests that are /api/*
app.use("/api", router);
// Port 80 will require elevated permissions on UNIX based machines
const port = process.env.PORT || 80;

app.listen(port, () => {
    // Connect to MySQL
    console.log(`Express.js is now running on port ${port}`)
});

// Connect to MySQL

db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE
});

db.connect(err => {
    if (err) throw err;
    console.log(`Successfully connected to MySQL! ${process.env.MYSQL_USER}:${process.env.MYSQL_PASS}@${process.env.MYSQL_HOST}`);
    db.query(`CREATE TABLE IF NOT EXISTS \`accounts\` (
        \`user_id\` INT unsigned NOT NULL AUTO_INCREMENT,
        \`username\` VARCHAR(20) NOT NULL,
        \`password\` VARCHAR(20) NOT NULL,
        PRIMARY KEY (\`user_id\`)
    );`, (err, result) => {
        if(err) throw err;
    });
    db.query(`CREATE TABLE IF NOT EXISTS \`wallets\` (
        \`user_id\` INT unsigned NOT NULL,
        \`wif\` VARCHAR(100) NOT NULL,
        \`nick\` VARCHAR(30) NOT NULL);`, (err, result) => {
        if(err) throw err;
    });
});