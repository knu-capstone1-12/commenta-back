const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const os = require('os');
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

const AWS = require('aws-sdk');
const CRT = require('./transcript-create-job');

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
    content: fs.readFileSync(filename).toString('base64')
  };
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 48000,
    languageCode: 'ko-KR'
  };
  const request = {
    audio: audio,
    config: config
  };

  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');
  console.log(`Transcription: ${transcription}`);
  return transcription;
}

app.get('/', (req, res) => {
  quickstart();
  res.send("Hello, World!");
});

app.post('/sttaws', upload.single('audio'), (req, res) => {
  require('dotenv').config();
  const { StartTranscriptionJobCommand } = require("@aws-sdk/client-transcribe");
  const { DeleteTranscriptionJobCommand } = require('@aws-sdk/client-transcribe');
  const { GetTranscriptionJobCommand } = require('@aws-sdk/client-transcribe');

  const { TranscribeClient } = require("@aws-sdk/client-transcribe");
  const REGION = "ap-northeast-2";
  const transcribeClient = new TranscribeClient({ region: REGION });

  const timestampFilePath = 'Timestamp.txt';
  const timestampValue = Date.now().toString(); // 원하는 값을 사용
  fs.writeFileSync(timestampFilePath, timestampValue, 'utf-8');

  const rtimestampFilePath = 'Timestamp.txt';
  const Timestamp = fs.readFileSync(rtimestampFilePath, 'utf-8');

  // Transcribe Input 파라미터 설정(S3 Bucket에서 입력합니다)
  const params = {
    TranscriptionJobName: "DIARY_JOB" + Timestamp,
    LanguageCode: "ko-KR", // For example, 'en-US'
    MediaFormat: "wav", // For example, 'wav'
    Media: {
      MediaFileUri: "https://capstond-diary.s3.ap-northeast-2.amazonaws.com/record.wav" + Timestamp
    },
    OutputBucketName: "capstond-output"
  };

  const run = async () => {
    try {

      const data = await transcribeClient.send(new StartTranscriptionJobCommand(params));
      console.log("Success - put", data.TranscriptionJobSummaries);

      return data; // For unit tests.

    } catch (err) {
      console.log("Error", err);
    }
  };

  const del_params = {
    TranscriptionJobName: "DIARY_JOB"
  };
  const delete_run = async () => {

    try {
      const data = await transcribeClient.send(new DeleteTranscriptionJobCommand(del_params));
      console.log("Success - deleted");
      return data; // For unit tests.
    } catch (err) {
      console.log("Error", err);
    }
  };

  AWS.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    retryDelayOptions: { base: 300 }
  });

  const s3 = new AWS.S3({ maxRetries: 10 });

  if (!req.file) {
    return res.status(400).send('Please Upload file');
  }

  const inputFilePath = req.file.path;
  const outputFilePath = path.join(__dirname, 'uploads', 'output.wav');

  ffmpeg().input(inputFilePath).audioFilters('pan=mono|c0=c0,asetrate=48000').audioCodec('pcm_s16le').toFormat('wav').on('end', () => {
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

    //AWS Transcribe API

    const AWSfilePath = './uploads/output.wav';

    const params = {
      Bucket: 'capstond-diary',
      Key: 'record.wav' + Timestamp,
      Body: fs.createReadStream(AWSfilePath)
    };

    delete_run().then(() => {
      //            s3.deleteObject({Bucket: "capstond-diary", Key: "record.wav"}, (err, data) => {
      //   if (err) {
      //     console.error('Error deleting object:', err);
      //   } else {
      //     console.log('Successfully deleted object:', data);
      //   }
      // });
    }).then(() => {
      //s3.deleteObject({Bucket: "capstond-output", Key: "DIARY_JOB"+Timestamp+".json"})
    }).then(() => {
      s3.upload(params, (err, data) => {
        if (err) {
          console.error('An Error occured while uploading', err);
        } else {
          console.log('Upload Complete(AWS)', data.Location);
          //res.json({'location': data.Location});

          run();
        }
      });
    });
    setTimeout(() => {
      console.log("DIARY_JOB" + Timestamp + ".json");
      console.log("DIARY_JOB" + Timestamp);
      setTimeout(() => {

        s3.getObject({ Bucket: "capstond-output", Key: "DIARY_JOB" + Timestamp + ".json" }, (err, data) => {
          if (err) {
            console.error('파일을 가져올 수 없습니다:', err);
          } else {
            const jsonContent = data.Body.toString('utf-8'); // JSON 파일 내용을 문자열로 변환

            try {
              const jsonData = JSON.parse(jsonContent); // JSON 문자열을 JavaScript 객체로 파싱
              console.log('JSON 데이터:', jsonData.results.transcripts[0].transcript);
              res.json({ "text": jsonData.results.transcripts[0].transcript });
            } catch (parseError) {
              console.error('JSON 파싱 오류:', parseError);
              res.status(500).send('JSON parse Error');
            }
          }
        });
      }, 10000);
    }, 500);

    //     s3.deleteObject({Bucket: "capstond-output", Key: "DIARY_JOB.json"}, (err, data) => {
    //   if (err) {
    //     console.error('Error deleting object:', err);
    //   } else {
    //     console.log('Successfully deleted object:', data);
    //   }
    // });

  }).on('error', err => {
    console.error('Error during conversion:', err);
    res.status(500).send('Error during conversion');
  }).save(outputFilePath);
});

app.post('/sttrec', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Please Upload file');
  }

  const inputFilePath = req.file.path;
  const outputFilePath = path.join(__dirname, 'uploads', 'output.wav');

  ffmpeg().input(inputFilePath).audioFilters('pan=mono|c0=c0,asetrate=48000').audioCodec('pcm_s16le').toFormat('wav').on('end', () => {
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
    quickstart().then(function (trans) {
      res.json({ text: trans });
    });
    //res.send(trans);
  }).on('error', err => {
    console.error('Error during conversion:', err);
    res.status(500).send('Error during conversion');
  }).save(outputFilePath);
});

app.listen(4000, () => console.log("Waiting on 4000 port."));
