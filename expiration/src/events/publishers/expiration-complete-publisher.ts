import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@tickets-sosghazaryan/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}