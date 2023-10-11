const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const upload = multer({ storage: multer.diskStorage({
        filename(req, file, done) {
            console.log(file);
            done(null, file.originalname);
        },
        destination(req, file, done) {
            console.log(file);
            done(null, path.join(__dirname, "uploads"));
        }
    }) });
//Express Load

const app = express();
//Express Application Definition

app.get('/', (req, res) => {
    res.send("Hello, World!");
});

app.post('/sttrec', upload.single('audio'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Please Upload file');
    }

    const inputFilePath = req.file.path;
    const outputFilePath = path.join(__dirname, 'uploads', 'output.mp3');

    ffmpeg().input(inputFilePath).audioCodec('libmp3lame').toFormat('mp3').on('end', () => {
        res.status(200).download(outputFilePath, 'output.mp3', err => {
            if (err) {
                console.error('Error while sending the converted file:', err);
            }

            //fs.unlinkSync(inputFilePath); // M4A 파일 삭제
            res.status(200).send('uploaded');
        });
    }).on('error', err => {
        console.error('Error during conversion:', err);
        res.status(500).send('Error during conversion');
    }).save(outputFilePath);
});

app.listen(4000, () => console.log("Waiting on 4000 port."));
