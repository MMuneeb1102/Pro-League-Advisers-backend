import { Router } from 'express';
const router = Router();
import { body } from "express-validator";
import playerAuthController from '../controllers/playerAuthController.js';
import fetchuser from '../middleware/fetchuser.js';
const { createUser, loginUser, getUser } = playerAuthController;

router.post('/create-user', [
    body("email").isEmail(),
    body("password").isLength({min: 8}),
    body("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password confirmation does not match password");
        }
        return true;
      })
], createUser);

router.post('/login-user', [
  body("email", "Enter a valid email").isEmail(),
  body("password", "password cannot be blanked").exists(),
], loginUser);

router.post('/getuser', fetchuser, getUser);

export default router;