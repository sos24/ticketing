import { Ticket } from '../../models/Ticket';

it('implements optimistic concurrency control',async () => {
    const ticket = Ticket.build({
        title: 'Ticket 1',
        price: 10,
        userId: '123'
    });
    await ticket.save();
   
    const firstTicket = await Ticket.findById(ticket.id);
    const secondTicket = await Ticket.findById(ticket.id);
    firstTicket?.set({
        price: 100
    });
    secondTicket?.set({
        price: 100
    });
    await firstTicket?.save();
    try {
        await secondTicket?.save();
    }catch (e) {
        return;
    }
    throw new Error('is not ok');
})

it('must change version',async () => {
    const ticket = Ticket.build({
        title: 'Ticket 1',
        price: 10,
        userId: '123'
    });
    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket?.save();
    expect(ticket.version).toEqual(1);
    await ticket?.save();
    expect(ticket.version).toEqual(2);
})