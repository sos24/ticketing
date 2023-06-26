import express, {Request, Response, NextFunction} from "express";
import { body } from "express-validator";
import { sign } from "jsonwebtoken";
import { User } from "../models/User";
import { BadRequestError, validateRequest } from "@tickets-sosghazaryan/common";

const router = express.Router();

router.post(
    '/api/users/signup',
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
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            throw new BadRequestError('Email in use');
        }
        
        const user = User.build({ email, password });
        await user.save();
        const token = sign({
           id: user._id,
           email: user.email, 
        }, process.env.JWT_KEY!);
        req.session = {
            jwt: token
        };
        res.status(201).json({
            user 
        });
    }
);

export { router as signupUserRouter };