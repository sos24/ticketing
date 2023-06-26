import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@tickets-sosghazaryan/common";
import { Ticket } from "../../models/Ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName: string = queueGroupName;
    async onMessage(data: TicketCreatedEvent['data'], msg: Message): Promise<void> {
        const ticket = Ticket.build({
            id: data.id,
            price: data.price,
            title: data.title
        });
        await ticket.save();
        msg.ack();
    }
}