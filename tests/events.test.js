const request = require('supertest');
const fs = require('fs');
const app = require('../app');

describe('Test the events service', () => {

    let events;

    beforeEach(() => {

        events = JSON.parse(fs.readFileSync("./data/events.json"));

    });

    afterEach(() => {

        fs.writeFileSync("./data/events.json", JSON.stringify(events, null, 2), 'utf8');

    });

    test('GET /events succeeds', () => {

        return request(app)
            .get('/events')
            .expect(200);
    });

    test('GET /events/:eventID succeeds', () => {

        return request(app)
            .get('/events/14f86883-90dd-4710-8c6e-0aad132204f4')
            .expect(200);
    });

    test('GET /events/:eventID fails with an invalid eventID', () => {

        return request(app)
            .get('/events/eventID')
            .expect(404);

    });

    test('POST /events/ creates an event successfully', () => {

        const params = {
            name: 'New event!',
            attendance: 0,
        };

        return request(app)
            .post('/events')
            .set("Content-Type", "application/json")
            .send(JSON.stringify(params))
            .expect(201);

    });


});

app.close();