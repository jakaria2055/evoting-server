import express from "express";
import { addNid, adminLogoutService, loginAdmin, registerAdmin, verifyAdmin } from "../controllers/adminController.js";
import { adminAuth } from "../middlewares/adminMiddleware.js";
import { registerUser } from "../controllers/userController.js";

const router = express.Router();

//ADMIN ROUTER
router.post('/admin/registration', registerAdmin);
router.post('/admin/verify', verifyAdmin);
router.post('/admin/login', loginAdmin);
router.post('/admin/logout',adminAuth, adminLogoutService);

router.post('/admin/add-nid',adminAuth, addNid);



//USER ROUTER
router.post('/user/registration', registerUser);


export default router;