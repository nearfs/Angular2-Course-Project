
module.exports = function ({data, fs, path, imageDecoder}) {

  function addAlbum(req, res) {
    const album = req.body;
    const imageData = req.body.dataUrl;

    let imageBuffer = imageDecoder.decode(imageData);
    let imageName = "album-" + Date.now() + ".jpg";
    let imagePath = path.join(__dirname, "..", "..", "/src/assets/images/album-pictures/", imageName)

    fs.writeFile(imagePath, imageBuffer.data, (err) => {
        if(err) {
            res.status(400);
            return res.json("Problem with saving the image. Please try again later.");
        } else {

            album.imgUrl = imageName;

            data.removeFromSingles(album.songs,album.artist)
                .then(()=> {
                    return data.addAlbum(album);
                })
                .then(() => {
                    res.status(201);
                    return res.json("Successfully added new album");
                })
                .catch((err) => {
                    res.status(400);
                    return res.json(err.message);
                });
        }
    });
  }

  return {
    name: "album",
    addAlbum
  };
};