const express = require('express');
const cors = require('cors');

const people = require("./routes/people.js");
const events = require("./routes/events.js");


const app = express();

const port = 3000;

app.use(cors());

app.use(express.json());

app.use("/people", people);
app.use("/events", events);


module.exports = app.listen(port, () => console.log(`\nServer listening on port ${port}`));
//
// module.exports = app;