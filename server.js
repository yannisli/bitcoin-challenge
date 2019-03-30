const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const logger = require("morgan");
const cookie = require("cookie");

// Load Dotenv configs
require('dotenv').config();

const app = express();

// Have express use these middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger("dev"));

// Serve built files
app.use(express.static(path.join(__dirname, 'reactapp/build')));

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
    if(!cookies || !cookies.pubKey || !cookies.privKey) {
        console.log("Cookies weren't present, unauthorized.");
        res.sendStatus(401);
        return;
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
    let secret = req.body.secret;
    // Check if valid, as well as check that there are no additional data in the body..
    if(!user || !secret || Object.keys(req.body).length !== 2)
    {
        res.sendStatus(400);
        return;
    }
    // MySQL request based on this user + secret
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
    let secret = req.body.secret;
    let public = req.body.publicKey;
    let private = req.body.privateKey;

    if(!user || !secret || !public || !private || Object.keys(req.body).length !== 4)
    {
        res.sendStatus(400);
        return;
    }

    // First, find if this user already exists
    // If doesn't exist, we can insert!
});
/**
 * PUT request for login/update. Used to update the user's public/private keys, or password
 */
router.put("/login/update", (req, res) => {
    // Read request body
    
})
/**
 * Delete request for login/delete. Used to delete a user
 */
router.delete("/login/delete", (req, res) => {

});
// Default request
router.get("*", (req, res) => {
    res.sendStatus(404);
});
// Use our router for any requests that are /api/*
app.use("/api", router);
// Port 80 will require elevated permissions on UNIX based machines
const port = process.env.PORT || 80;

app.listen(port, () => console.log(`Express.js is now running on port ${port}`));