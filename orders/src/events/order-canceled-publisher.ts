import { Publisher, OrdeCanceledEvent, Subjects } from "@tickets-sosghazaryan/common";

export class OrderCanceledPublisher extends Publisher<OrdeCanceledEvent> {
    subject: Subjects.OrderCanceled = Subjects.OrderCanceled;
}