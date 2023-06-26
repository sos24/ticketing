import mongoose from 'mongoose';
import { OrderStatus } from '@tickets-sosghazaryan/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export const expiresTime = 10;

interface OrderAttrs {
  id: string;
  userId: string;
  price: number;
  status: OrderStatus;
  version: number;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  price: number;
  status: OrderStatus;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(orderAttrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: OrderStatus,
      default: OrderStatus.Created,
    },
    userId: {
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
      },
    },
  }
);

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    status: attrs.status,
    userId: attrs.userId,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order, OrderStatus };
