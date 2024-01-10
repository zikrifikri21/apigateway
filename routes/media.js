const express = require("express");
const router = express.Router();
const isBase64 = require("is-base64");
const base64Img = require("base64-img");
const { Media } = require("../models");
const fs = require("fs");

/* GET media listing. */
router.get("/", async (req, res) => {
  try {
    const medias = await Media.findAll();
    const mappedMedia = medias.map((media) => {
      media.image = `${req.get("host")}/${media.image}`;
      return media;
    });

    return res.json({
      status: "success",
      data: mappedMedia,
    });
  } catch (error) {
    return res.status(500).send({ status: "error", message: error.message });
  }
});

/* POST media listing. */
router.post("/", function (req, res) {
  const image = req.body.image;

  if (!isBase64(image, { mimeRequired: true })) {
    return res.status(400).send({ status: "error", message: "Invalid base64" });
  }

  try {
    base64Img.img(image, "./public/images", Date.now(), async (err, filepath) => {
      if (err) {
        return res.status(500).send({ status: "error", message: err.message });
      }

      const filename = filepath.split("\\").pop().split("/").pop();
      // try {
      const media = await Media.create({
        image: `images/${filename}`,
      });

      return res.json({
        status: "success",
        data: {
          id: media.id,
          image: `${req.get("host")}/images/${filename}`,
        },
      });
      // } catch (error) {
      //   return res.status(500).send({ status: "error", message: error.message });
      // }
    });
  } catch (error) {
    return res.status(500).send({ status: "error", message: error.message });
  }
});

/* DELETE media listing. */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const media = await Media.findByPk(id);

    if (!media) {
      return res.status(404).send({ status: "error", message: "Media not found" });
    }

    fs.unlinkSync(`./public/${media.image}`, async (err) => {
      if (err) {
        return res.status(400).send({ status: "error", message: err.message });
      }
    });

    await media.destroy();

    return res.json({
      status: "success",
      message: "Media deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({ status: "error", message: error.message });
  }
});

module.exports = router;
