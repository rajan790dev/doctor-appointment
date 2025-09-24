import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads/"); // make sure "uploads" folder exists in root
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage });

export default upload;
