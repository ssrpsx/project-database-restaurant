import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../..", "client", "public", "uploads"));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const newName = "banner_" + Date.now() + ext;
        cb(null, newName);
    }
});


export const upload = multer({ storage });