import express from 'express';
import {
  registerUser,
  loginUser,
  updateUserDetails,
  deleteUser,
  getAllUser
} from '../controllers/user.controller.js';

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update", updateUserDetails);  // or PATCH
router.delete("/:id", deleteUser);
router.get("/", getAllUser);

export default router;
