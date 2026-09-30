import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (_req, file, callback) => {
  if (file.mimetype.startsWith("image/")) {
    return callback(null, true);
  }

  return callback(new Error("Solo se permiten archivos de imagen"));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
