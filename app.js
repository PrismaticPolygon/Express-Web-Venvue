const express = require('express');
const moment = require('moment');
const url = require('url');
const app = express();
const port = 3000;

const users = [{
    username: "doctorwhocomposer",
    forename: "Delia",
    surname: "Derbyshire"
}];

events = [{
    name: "Sunday Night Klute",
    description: [
        "The best night in the worst club in Durham.",
        "",
        "",
        "£1 Jaegerbombs all night!"
    ],
    start: moment().add(1, 'day').hour(21).minute(0).toDate(),
    end: moment().add(2, 'day').hour(2).minute(0).toDate(),
    created: moment().toDate(),
    changed: moment().toDate(),
    current_attendance: 45,
    max_attendance: 82,
    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><title>="Sunday ' +
    'Night Klute"</title><circle cx="30" cy="30" r="27" fill="none" stroke="#e6e6e6" stroke-width="6" /><circle cx="30" cy="30" r="27" ' +
    'fill="none" stroke="#9DDC01" stroke-width="6" stroke-dasharray="169.64600329384882" stroke-dashoffset="93.30530181161686" ' +
    'stroke-linecap="round" transform="rotate(-90 30 30)"/></svg>',
    id: "0JUEUOSwQu7ICgJ9T3pN",
    location: {
        lat: 51.121910799999995,
        lng: 0.2614605 },
    venue: {
        capacity: 100,
        location: {
            lat: 51.121910799999995,
            lng: 0.2614605 },
        name: "Klute"
    }
}, {
    name: "Shakermaker 14/12/17 at Wiff Waff w/Mustard Yellow - Free Entry",
    description: [
        "FREE ENTRY | £10 BEER PONG | £3 DOUBLES | INDIE - ALT",
        "On the 14th of December we'll be filling out a floor at Wiff Waff with our classic cocktail of great alternative and indie rock, cheap beer pong, and great drinks deals!",
        "This time we've got Durham's own Mustard Yellow (Armaan Sandhu, Ed O'Callaghan, Luke Demetriou, Mo Hafeez) to play a few tunes before our DJs give you your fix of alt and indie tunes - make sure you get on down from 10 to give them a listen!",
        "TL;DR",
        "Shakermaker's policy is simple: come down from 10, we play tunes, you drink, you dance, you enjoy yourselves, you tell your friends, we see you again the next time round",
        "Durham's Meccah for all things Alt and indie is back, with quality music, cheap Redstripe, bombs, and beer pong to fuel you through it.",
        "",
        "MUSIC",
        "JAM DJ and MO HAFEEZ will be bringing music from the likes of the Arctic Monkeys, The Smiths, Courteeners, The Stone Roses, Blur, Oasis, The Smiths, The Rolling Stones, Alt J, Kasabian, Tame Impala, Joy Division, New Order, David Bowie, The Prodigy, MGMT, M83, Mount Kimbie, Mura Masa, Beck, The Cure, Primal Scream, Flume, Disclosure, Jamie XX, James Blake and much more.",
        "",
        "",
        "Post your requests on the wall and we'll play your tunes on the night!",
        "",
        "DRINKS DEALS",
        "£2 Bombs // £3 Redstripe // £3 Pints of Bud // £3 Double Vodka Mixers",
        "£10 BUDWEISER BEER PONG"
    ],
    start: moment().add(3, 'day').hour(21).minute(30).toDate(),
    end: moment().add(4, 'day').hour(3).minute(0).toDate(),
    created: moment().toDate(),
    changed: moment().toDate(),
    current_attendance: 124,
    max_attendance: 124,
    icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><title>="Shakermaker"</title><circle cx="30" cy="30" r="27" fill="none" stroke="#e6e6e6" stroke-width="6" /><circle cx="30" cy="30" r="27" fill="none" stroke="#31CE02" stroke-width="6" stroke-dasharray="169.64600329384882" stroke-dashoffset="127.57379447697431" stroke-linecap="round" transform="rotate(-90 30 30)"/></svg>',
    id: "0JUEUOSwQu7ICgJ9T3pN",
    location: {
        lat: 51.13,
        lng: 0.2615 },
    venue: {
        capacity: 500,
        location: {
            lat: 51.13,
            lng: 0.2615
        },
        name: "WiffWaff"
    }
}];

app.route("/people")
    .get((req, res) => {

        return res.send(users).end(200);

    })
    .post((req, res) => {

        const access_token = req.get("access_token");

        if (!access_token || access_token !== "concertina") {

            return res.sendStatus(403);

        }

        const user = users.find(user => user.username = req.params.username);

        if (user) {

            return res.sendStatus(409);

        }

        if (Object.keys(req.params)["username", "forename", "surname"]) {

            users.push(req.params);

            return res.sendStatus(201);

        } else {

            return res.sendStatus(400);

        }

});

app.route("events")
    .get((req, res) => {

        return res.send(events).end(200);

    });

app.route('/people/:username')
    .get((req, res) => {

        const username = req.params.username;

        if (!username) {

            return res.sendStatus(400);

        }

        const user = users.find(user => user.username = username);

        if (!user) {

            return res.sendStatus(404);

        } else {

            return res.send(user);

        }

});

app.listen(port, () => console.log(`\nServer listening on port ${port}`));

module.exports = app;