import {Router} from "express";
import {requestRegistrationCode,verifyRegistration} from "../controllers/register.controller.js";
import {upload} from "../middlewares/upload.js";
const router=Router();
router.post("/",requestRegistrationCode);
router.post("/send-code",requestRegistrationCode);
router.post("/verify",upload.single("profilePhoto"),verifyRegistration);
export default router;

