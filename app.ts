const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/'); // 파일이 저장되는 경로입니다.
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname); // 파일 저장 포멧
        },
});
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

    // 파일을 저장할 경로를 지정
    // const filePath = path.join(__dirname, 'uploads', req.file.originalname);

    // // 파일을 저장
    // fs.writeFile(filePath, req.file.buffer, (err) => {
    //     if (err) {
    //         return res.status(500).send('File could not be saved');
    //     }

    //         res.status(200).send('uploaded');

    // });
    res.status(200).send('uploaded');


})

app.listen(4000, () => console.log("Waiting on 4000 port."));

