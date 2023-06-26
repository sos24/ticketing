import express, {Request, Response, NextFunction} from "express";
import { body } from "express-validator";
import { User } from "../models/User";
import { sign } from "jsonwebtoken";
import { Password } from "../services/Password";
import { BadRequestError, validateRequest } from "@tickets-sosghazaryan/common";

const router = express.Router();

router.post(
    '/api/users/signin',
    [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Email not valid'),
        body('password')
            .trim()
            .isLength({ min:4, max: 20 })
            .withMessage('password not valid'),
    ],
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
    
        const { email, password } = req.body;
        const user = await User.findOne({email});
        if (!user) {
            throw new BadRequestError('user not found');
        }
        
        const verifed = await Password.compare(user.password, password);
        if (!verifed) {
            throw new BadRequestError('user not found');
        }

        const token = sign({
            id: user._id,
            email: user.email, 
         }, process.env.JWT_KEY!);
         req.session = {
             jwt: token
         };
         res.status(200).json({
             user 
         });
    }
)

export { router as signinUserRouter };