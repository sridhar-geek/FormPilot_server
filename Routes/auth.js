import { Router } from "express";
import { login, recharge } from "../Controller/auth.js";
const router = Router()

router.post('/', login)
router.post('/recharge', recharge)

export default router;