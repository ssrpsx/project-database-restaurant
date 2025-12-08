import express from 'express'
import { login, change } from '../controllers/auth.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.post('/login', login)

router.post('/change', auth, change)

export default router