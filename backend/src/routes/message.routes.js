import express from "express"
import {protectRoute} from "../middleware/auth.middleware.js";
import {getUserForSideabar,getMessages,sendMessages} from "../controllers/message.controllers.js";


const router = express.Router();

router.get("/user", protectRoute, getUserForSideabar)
router.get("/:id", protectRoute, getMessages)
router.post("/send/:id", protectRoute, sendMessages)

export default router;