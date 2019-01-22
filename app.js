const express = require('express');
const moment = require('moment');
const url = require('url');
const cors = require('cors');
const app = express();

const port = 3000;
app.use(cors());

const users = [{
    username: "doctorwhocomposer",
    forename: "Delia",
    surname: "Derbyshire"
}];


function generateMarkerIconSVG (event) {

    // https://codepen.io/xgad/post/svg-radial-progress-meters
    // https://github.com/TypeCtrl/tinycolor
    // https://stackoverflow.com/questions/2593832/how-to-interpolate-hue-values-in-hsv-colour-space
    // http://www.perbang.dk/rgbgradient/

    const colourSteps = [
            "#03C03C",
            "#03C03B",
            "#02C133",
            "#02C22A",
            "#02C421",
            "#02C517",
            "#02C60E",
            "#02C805",
            "#09C902",
            "#13CA02",
            "#1DCC02",
            "#27CD02",
            "#31CE02",
            "#3BD002",
            "#45D102",
            "#50D202",
            "#5BD402",
            "#65D502",
            "#70D602",
            "#7BD802",
            "#86D902",
            "#92DA01",
            "#9DDC01",
            "#A9DD01",
            "#B4DE01",
            "#C0E001",
            "#CCE101",
            "#D8E201",
            "#E4E301",
            "#E5D901",
            "#E6D001",
            "#E8C601",
            "#E9BC01",
            "#EAB101",
            "#ECA701",
            "#ED9C01",
            "#EE9200",
            "#F08700",
            "#F17C00",
            "#F27100",
            "#F46600",
            "#F55B00",
            "#F64F00",
            "#F84400",
            "#F93800",
            "#FA2C00",
            "#FC2000",
            "#FD1400",
            "#FF0700",
            "#FF0800"
        ],
        percentage = event.attendance / event.venue.capacity,
        colour = colourSteps[Math.floor(percentage * colourSteps.length)],
        size = 60,
        strokeWidth = size * 0.1,
        radius = (size / 2) - (strokeWidth / 2),
        // imageSize: number = 2 * (radius - strokeWidth),
        circumference = 2 * Math.PI * radius;

    // Deal with '#' deprecation (replace with %23)

    return `data:image/svg+xml;utf8,` +
        `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
        `<title>="${event.title}"</title>` +
        //`<image xlink:href="${image}" x="${(size - imageSize) / 2}" y="${(size - imageSize) / 2}" height="${imageSize}px" width="${imageSize}px"/>` +
        `<circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" stroke="#e6e6e6" stroke-width="${strokeWidth}" />` +
        `<circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" stroke="${colour}" stroke-width="${strokeWidth}" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference * (1 - percentage)}" stroke-linecap="round" transform="rotate(-90 ${size / 2} ${size / 2})"/>` +
        `</svg>`;

};

function getRandomInt(min, max) {

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;

}

function addEventData(event) {

    const minimumHour = moment().hour();
    const startHour = getRandomInt(minimumHour, 24);

    event['start'] = moment().hour(startHour).minute(0).toDate();

    if (getRandomInt(0, 2) === 1) {

        const endHour = getRandomInt(startHour, 24);

        event['end'] = moment().hour(endHour).minute(0).toDate();

    } else {

        const endHour = getRandomInt(0, 24);

        event['end'] = moment().add(1, 'day').hour(endHour).minute(0).toDate();

    }

    event['attendance'] = getRandomInt(0, event.venue.capacity);
    event['icon'] = generateMarkerIconSVG(event);

}

const events = [
    {
        name: "Sunday Night Klute",
        attendance: 0,
        venue: {
            capacity: 100,
            location: {
                latitude: 54.7759984,
                longitude: -1.5761528
            },
            name: "Klute"
        }
    }, {
        name: "Shakermaker @ Wiff Waff w/Mustard Yellow - Free Entry",
        attendance: 0,
        venue: {
            capacity: 500,
            location: {
                latitude: 54.7772503,
                longitude: -1.5787726
            },
            name: "Wiff Waff"
        }
    }, {
        name: "UV Party",
        attendance: 0,
        venue: {
            capacity: 200,
            location: {
                latitude: 54.7761246,
                longitude: -1.5763708
            },
            name: "Jimmy Allens"
        }
    }, {
        name: "Crowd 9 Presents 'All of the Lights' - KANYE WEST Special",
        attendance: 0,
        venue: {
            capacity: 1000,
            location: {
                latitude: 54.7776981,
                longitude: -1.5775439
            },
            name: "Players' Bar"
        }
    }, {
        name: "Northen Psychic",
        attendance: 0,
        venue: {
            capacity: 600,
            location: {
                latitude: 54.7760304,
                longitude: -1.5766004
            },
            name: "Osbournes"
        }
    }, {
        name: "Gospel",
        attendance: 0,
        venue: {
            capacity: 800,
            location: {
                latitude: 54.776922,
                longitude: -1.5829162
            },
            name: "Loft"
        }
    }];

// All of them are shifted over slightly. I IMAGINE it's the menu, but that's difficult to prove....

events.forEach(event => addEventData(event));


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

        if (Object.keys(req.params) === ["username", "forename", "surname"]) {

            users.push(req.params);

            return res.sendStatus(201);

        } else {

            return res.sendStatus(400);

        }

});

app.route("/events")
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

module.exports = app.listen(port, () => console.log(`\nServer listening on port ${port}`));
//
// module.exports = app;