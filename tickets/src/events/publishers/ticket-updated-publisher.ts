import {Publisher, Subjects, TicketUpdatedEvent} from '@tickets-sosghazaryan/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated; 
}