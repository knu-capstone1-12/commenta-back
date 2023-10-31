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

const PROJECT_ID = 'diarystt';
const SERVICE_KEY_FILE = './key.json';

const AUDIO_FILE = './uploads/output.mp3';

const BUCKET_NAME = 'bucket';

const app = express();
//Express Application Definition

const speech = require('@google-cloud/speech');


const client = new speech.SpeechClient();

let Transcription = null;

async function quickstart() {
    // The path to the remote LINEAR16 file

    const filename = './uploads/output.wav';

    const gcsUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
      content: fs.readFileSync(filename).toString('base64'),
    };
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 48000,
      languageCode: 'ko-KR',
    };
    const request = {
      audio: audio,
      config: config,
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);
    return transcription;
  }

app.get('/', (req, res) => {
    quickstart();
    res.send("Hello, World!");
})

app.post('/sttrec', upload.single('audio'), (req, res) => {
    if(!req.file) {
        return res.status(400).send('Please Upload file');
    }

    const inputFilePath = req.file.path;
    const outputFilePath = path.join(__dirname, 'uploads', 'output.wav');

    ffmpeg()
    .input(inputFilePath)
    .audioFilters('pan=mono|c0=c0,asetrate=48000')
    .audioCodec('pcm_s16le')
    .toFormat('wav')
    .on('end', () => {
      // res.status(200).download(outputFilePath, 'output.wav', (err) => {
      //   if (err) {
      //     console.error('Error while sending the converted file:', err);
      //   }
      //   let Transcription = quickstart();
      //   res.send(Transcription);
      //   //Upload 완료 후 Google GCP API Call 구현 예정
        
      //   //fs.unlinkSync(inputFilePath); // M4A 파일 삭제
      //   //res.status(200).send('uploaded');

      // });
      quickstart().then(function(trans)
      {
        res.json({text:trans});
      }

      );
      //res.send(trans);
    })
    .on('error', (err) => {
      console.error('Error during conversion:', err);
      res.status(500).send('Error during conversion');
    })
    .save(outputFilePath);
    

})

app.listen(4000, () => console.log("Waiting on 4000 port."));

