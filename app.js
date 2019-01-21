const express = require('express');
const url = require('url');
const app = express();
const port = 3000;

const users = [{
    username: "doctorwhocomposer",
    forename: "Delia",
    surname: "Derbyshire"
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

app.listen(port);

module.exports = app;