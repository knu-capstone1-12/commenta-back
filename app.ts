const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const upload = multer({storage: multer.diskStorage({
      	filename(req, file, done) {
          	console.log(file);
			done(null, file.originalname);
        },
		destination(req, file, done) {
      		console.log(file);
		    done(null, path.join(__dirname, "uploads"));
	    },
    }),}
    );
//Express Load

const app = express();
//Express Application Definition

app.get('/', (req, res) => {
    res.send("Hello, World!");
})

app.post('/sttrec', upload.single('audio'), (req, res) => {
    if(!req.file) {
        return res.status(400).send('Please Upload file');
    }
    res.status(200).send('uploaded');

})

app.listen(4000, () => console.log("Waiting on 4000 port."));

