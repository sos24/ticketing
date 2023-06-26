import Router from "next/router";
import useRequest from "../../hooks/useRequest";

const Ticket = ({ticket}) => {
    const {doRequest, errors} = useRequest({
        url: '/api/orders',
        method: 'post',
        body: {
            ticketId: ticket.id
        },
        onSucces: ({order}) => Router.push(`/orders/${order.id}`)
    });
    const purchaseClick = (e) => {
        e.preventDefault();
        doRequest();
    }
    return (
      <>
        <div>{ticket.title}</div>
        <div>{ticket.price}</div>
        {errors}
        <button onClick={purchaseClick} className="btn btn-primary">Purchase</button>
      </>  
    );
}

Ticket.getInitialProps = async (context, client, currentuser) => {
    let ticket = {};
    try {
        const { ticketId } = context.ctx.query;
        const response = await client.get(`/api/tickets/${ticketId}`);
        if (response.data.ticket) {
            ticket = { ...response.data.ticket };
        }
    } catch(e) {
        console.log(e)
    }
    return {
        ticket,
    }
}

export default Ticket;