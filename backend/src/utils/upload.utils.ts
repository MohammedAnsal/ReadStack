import multer from "multer";

const storage = multer.memoryStorage();
const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

export const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB

  fileFilter: (req, file, cb) => {
    const { fieldname, mimetype } = file;

    const validFields = ["profile", "image"];

    if (!validFields.includes(fieldname)) {
      return cb(
        new Error(
          `Invalid field name: ${fieldname}. Expected 'profile' or 'image'.`
        )
      );
    }

    if (!allowedTypes.includes(mimetype)) {
      return cb(new Error("Only JPG, PNG, WEBP images allowed"));
    }

    return cb(null, true);
  },
});
