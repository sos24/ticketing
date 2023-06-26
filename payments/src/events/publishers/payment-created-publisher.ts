import {
  Subjects,
  PaymentCreatedEvent,
  Publisher,
} from '@tickets-sosghazaryan/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
