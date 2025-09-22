import express from "express";
import { addNid, addParties, adminLogoutService, getNID, getParty, loginAdmin, registerAdmin, verifyAdmin } from "../controllers/adminController.js";
import { adminAuth } from "../middlewares/adminMiddleware.js";
import { getPartiesByPosition, loginUser, registerUser, submitVote, userLogout } from "../controllers/userController.js";
import { userAuth } from "../middlewares/userMiddleware.js";
import { getAllParties, getVoteResults } from "../controllers/voteController.js";

const router = express.Router();

//ADMIN ROUTER
router.post('/admin/registration', registerAdmin); //okk
router.post('/admin/verify', verifyAdmin); //okk
router.post('/admin/login', loginAdmin); //okk
router.post('/admin/logout',adminAuth, adminLogoutService); //okk

router.post('/admin/add-nid',adminAuth, addNid); //okk
router.get('/admin/read-nid',adminAuth, getNID); //okk

router.post('/admin/add-party',adminAuth, addParties); //okk
router.get('/admin/read-party',adminAuth, getParty); //okk



//USER ROUTER
router.post('/user/registration', registerUser); //okk
router.post('/user/login', loginUser); //okk
router.post('/user/logout',userAuth, userLogout); //okk

router.get('/user/listByPosition/:position',userAuth, getPartiesByPosition); //okk
router.get('/user/read-party',userAuth, getParty); //okk

router.post('/user/submit-vote/:id/:position',userAuth, submitVote); //okk

router.get('/user/get-result', getVoteResults); //okk

router.get('/user/getAvailableParty', getAllParties); //okk



export default router;