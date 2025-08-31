import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images"); // destination folder
  },
  filename: (req, file, cb) => {
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, uuidv4() + "." + ext); // unique filename
    // cb(null, uploadPath);
  },
});

const fileUpload = multer({
  limits: { fileSize: 5000000 }, // 5 MB
  storage: storage,
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    const error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

export default fileUpload;
