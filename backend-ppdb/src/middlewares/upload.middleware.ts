import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = "/tmp/uploads";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
 backend

  limits: {
    fileSize: 2 * 1024 * 1024,
  },

  limits: { fileSize: 5 * 1024 * 1024 }, // max 2MB
 frontend
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png"];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Format file tidak didukung"));
    }

    cb(null, true);
  },
});
