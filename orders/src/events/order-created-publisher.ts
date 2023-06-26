import { Publisher, OrderCreatedEvent, Subjects } from "@tickets-sosghazaryan/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}