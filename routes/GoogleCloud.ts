app.post("/sttrec", upload.single("audio"), (req, res) => {
  console.log("== Incoming Connection (/sttrec) - GCP Cloud STT API ==");
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
      quickstart().then(function (trans) {
        res.json({ text: trans });
      });
    })
    .on("error", (err) => {
      console.error("=== An Error Occured during Conversion: Response 500 ===");
      res.status(500).send("Error during conversion");
    })
    .save(outputFilePath);
});
