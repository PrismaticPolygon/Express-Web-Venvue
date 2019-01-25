const express = require('express');
const moment = require('moment');
const fs = require('fs');
const uuid = require("uuid/v4");

const events = JSON.parse(fs.readFileSync("./data/events.json"));
const router = express.Router();

function randomiseEvents() {

    function getRandomInt(min, max) {

        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;

    }

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

    events.forEach(event => {

        const minimumHour = moment().hour();
        const startHour = getRandomInt(minimumHour, 23);

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

    });

}

randomiseEvents();


router.get("/", (req, res) => {

    return res.send(events).end(200);

});

router.get("/:eventID", (req, res) => {

    const eventID = req.params.eventID;

    if (!eventID) {

        return res.sendStatus(400);

    } else {

        const event = events.find(events => events.eventID === eventID);

        if (!event) {

            return res.sendStatus(404);

        } else {

            return res.send(event).end(200);

        }

    }

});

router.post("/", (req, res) => {

    const event = req.body;
    event["eventID"] = uuid();

    events.push(event);

    fs.writeFileSync("./data/events.json", JSON.stringify(events, null, 2), 'utf8');

    return res.sendStatus(201);

});

module.exports = router;