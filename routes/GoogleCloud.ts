app.post("/sttrec", upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("Please Upload file");
  }

  const inputFilePath = req.file.path;
  const outputFilePath = path.join(__dirname, "uploads", "output.wav");

  ffmpeg()
    .input(inputFilePath)
    .audioFilters("pan=mono|c0=c0,asetrate=48000")
    .audioCodec("pcm_s16le")
    .toFormat("wav")
    .on("end", () => {
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
    })
    .on("error", (err) => {
      console.error("Error during conversion:", err);
      res.status(500).send("Error during conversion");
    })
    .save(outputFilePath);
});
