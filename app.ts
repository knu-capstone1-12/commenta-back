const express = require('express');
//Express Load

const app = express();
//Express Application Definition

app.get('/', (req, res) => {
    res.send("Hello, World!");
})

app.listen(4000, () => console.log("Waiting on 4000 port."));

