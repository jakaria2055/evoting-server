import express from "express";
import { adminLogoutService, loginAdmin, registerAdmin, verifyAdmin } from "../controllers/adminController.js";

const router = express.Router();

//ADMIN ROUTER
router.post('/admin/registration', registerAdmin);
router.post('/admin/verify', verifyAdmin);
router.post('/admin/login', loginAdmin);
router.post('/admin/logout', adminLogoutService);


export default router;