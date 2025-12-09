import { Router } from 'express';
import { save, get_data } from '../controllers/settingSave';
import { upload } from "../middleware/uploads";

const router = Router();

router.post("/save", upload.single("banner"), save);

router.get('/get', get_data);

export default router;