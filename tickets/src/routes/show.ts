import express, {Request, Response} from 'express';

import { NotFoundError } from '@tickets-sosghazaryan/common';
import { Ticket } from '../models/Ticket';
import mongoose from 'mongoose';

const router = express.Router();

router.get(
    '/api/tickets/:id',
     async (req: Request, res: Response) => {
        if (!req.params.id) {
            throw new NotFoundError();
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw new NotFoundError();
        }

        const ticket = await Ticket.findById(req.params.id);
        
        if (!ticket) {
            throw new NotFoundError();
        }
        
        res.status(200).send({
            ticket
        });
    }
)

export {router as showTicketRouter};