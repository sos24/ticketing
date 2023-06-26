import mongoose from 'mongoose';
import { OrderStatus } from '@tickets-sosghazaryan/common';
import { TicketDoc } from './Ticket';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export const expiresTime = 60;

interface OrderAttrs {
  userId: string;
  ticket: TicketDoc;
  status: OrderStatus;
  expiresAt: Date;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  ticket: TicketDoc;
  status: OrderStatus;
  expiresAt: Date;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(orderAttrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
    status: {
      type: String,
      enum: OrderStatus,
      default: OrderStatus.Created,
    },
    userId: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order, OrderStatus };
