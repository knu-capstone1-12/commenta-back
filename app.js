const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const storage = multer.memoryStorage();
const upload = multer({ storage });
//Express Load

const app = express();
//Express Application Definition

app.get('/', (req, res) => {
    res.send("Hello, World!");
});

app.post('/sttrec', upload.single('files'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Please Upload file');
    }

    res.status(200).send('uploaded');
});

app.listen(4000, () => console.log("Waiting on 4000 port."));
