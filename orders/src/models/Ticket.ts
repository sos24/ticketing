import mongoose from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { Order, OrderStatus } from "./Order";

interface TicketAttrs {
    id: string
    title: string,
    price: number,
}

interface TicketDoc extends mongoose.Document {
    title: string,
    price: number,
    isReserved(): boolean,
    version: number,
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(ticketAttrs: TicketAttrs): TicketDoc;
    findByEvent(event: {id: string, version: number}): Promise<TicketDoc | null> 
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            require: true,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        },
    },
);

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    })
}
ticketSchema.statics.findByEvent = (event: {id: string, version: number}) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1
    });
}

ticketSchema.methods.isReserved = async function () {
    const oldOrder = await Order.findOne({
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete,
            ]
        },
        ticket: this
    });
    return !!oldOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket, TicketDoc };