import express from 'express';
import {loginController, registerController} from '../controllers/authControllers.js'
import { updateUnreadMessages } from '../controllers/msgControllers.js';


const router = express.Router();


router.post('/auth/register', registerController);
router.post('/auth/login', loginController);
router.post("/db/user/user-contacts/unread-messages", updateUnreadMessages);

export default router;