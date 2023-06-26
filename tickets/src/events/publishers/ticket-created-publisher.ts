import {Publisher, Subjects, TicketCreatedEvent} from '@tickets-sosghazaryan/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated; 
}