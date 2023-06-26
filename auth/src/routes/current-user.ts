import express from "express";
import { currentUser } from "@tickets-sosghazaryan/common";

const router = express.Router();

router.get('/api/users/currentuser', currentUser, async (req, res, next) => {
    return res.json({
        user: req.currentUser || null
    });
})

export { router as currentUserRouter };