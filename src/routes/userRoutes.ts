
import { changePasswordController, changePasswordOTPVerificationController, createTransferPinController, deleteController, forgotPasswordController, getBankAccountDetailsController, getSingleController, logOutController, registerPhoneController, suspendedAccountActivation, loginController, registerController, verifyBankTransferPinController, verifyEmailController, verifyPhoneController } from "../controllers/userController";

import { checkUserAuthMiddelware } from "../midleware/checkUserAuth";

const express = require('express');
const userRouter = express.Router();

/* Auth Routes */
userRouter.post("/register", registerController)

userRouter.post("/login", loginController)

userRouter.get("/logout", checkUserAuthMiddelware, logOutController)

userRouter.get("/emailVerify/:email/:token", verifyEmailController)

// send user email for password change
userRouter.post("/forgotPasswordOTPSender", forgotPasswordController)

// verify OTP sent for password chnage
userRouter.post("/changePassword/OTPveirfy",changePasswordOTPVerificationController)


// update the password with the new password sent
userRouter.post("/reset-password", changePasswordController)


userRouter.post("/registerPhone",checkUserAuthMiddelware, registerPhoneController)

userRouter.post("/verifyPhone",checkUserAuthMiddelware, verifyPhoneController)


/* User Routes */
userRouter.get("/:id", checkUserAuthMiddelware, getSingleController)



userRouter.delete("/delete/:id",checkUserAuthMiddelware,deleteController )



// create payment  pin

userRouter.post("/account/transferPinCreation", checkUserAuthMiddelware,createTransferPinController)


// get ban details
userRouter.get("/account/details", checkUserAuthMiddelware,getBankAccountDetailsController)


//verify bank transfer pic

userRouter.post("/account/tranferPinVerify", checkUserAuthMiddelware,verifyBankTransferPinController)




// activete suspended account
userRouter.get("/account/suspended/activate/:id", suspendedAccountActivation)



export default userRouter


/* getBankAccountDetails */