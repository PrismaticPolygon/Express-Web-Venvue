const express = require('express');
const fs = require('fs');

const people = JSON.parse(fs.readFileSync("./data/people.json"));
const router = express.Router();

router.get("/", (req, res) => {

    return res.send(people).end(200);

});

router.get("/:username", (req, res) => {

    const username = req.params.username;

    if (!username) {

        return res.sendStatus(400);

    }

    const person = people.find(person => person.username === username);

    if (!person) {

        return res.sendStatus(404);

    } else {

        return res.send(person);

    }

});

router.post("/", (req, res) => {

    const access_token = req.get("access_token");

    if (!access_token || access_token !== "concertina") {

        return res.sendStatus(403);

    }

    const new_person = req.body;
    const person = people.find(person => person.username === new_person.username);

    if (person) {

        return res.sendStatus(400).end("User already exists");

    }

    people.push(new_person);

    fs.writeFileSync("./data/people.json", JSON.stringify(people, null, 2), 'utf8');

    return res.sendStatus(201);

});

module.exports = router;