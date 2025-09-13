import express from "express";
import { addNid, addParties, adminLogoutService, getNID, getParty, loginAdmin, registerAdmin, verifyAdmin } from "../controllers/adminController.js";
import { adminAuth } from "../middlewares/adminMiddleware.js";
import { getPartiesByPosition, loginUser, registerUser, submitVote, userLogout } from "../controllers/userController.js";
import { userAuth } from "../middlewares/userMiddleware.js";
import { getAllParties, getVoteResults } from "../controllers/voteController.js";

const router = express.Router();

//ADMIN ROUTER
router.post('/admin/registration', registerAdmin);
router.post('/admin/verify', verifyAdmin);
router.post('/admin/login', loginAdmin);
router.post('/admin/logout',adminAuth, adminLogoutService);

router.post('/admin/add-nid',adminAuth, addNid);
router.get('/admin/read-nid',adminAuth, getNID);

router.post('/admin/add-party',adminAuth, addParties);
router.get('/admin/read-party',adminAuth, getParty);



//USER ROUTER
router.post('/user/registration', registerUser);
router.post('/user/login', loginUser);
router.post('/user/logout',userAuth, userLogout);

router.get('/user/listByPosition/:position',userAuth, getPartiesByPosition);
router.get('/user/read-party',userAuth, getParty);

router.post('/user/submit-vote/:id/:position',userAuth, submitVote);

router.get('/user/get-result', getVoteResults);

router.get('/user/getAvailableParty', getAllParties);



export default router;