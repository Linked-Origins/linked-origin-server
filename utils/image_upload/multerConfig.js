const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinaryConfig");

function createMulter(folderName) {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName,
      allowed_formats: ["jpg", "jpeg", "png"],
    },
  });

  return multer({ storage });
}

const multerMiddleware = (folderName) => {
  console.log(folderName);
  const upload = createMulter(folderName).single("image");
  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Upload error", error: err.message });
      }
      next();
    });
  };
};

module.exports = multerMiddleware;
