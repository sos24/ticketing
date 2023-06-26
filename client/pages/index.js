import Link from "next/link";

const Home = ({user, tickets}) => {
    const ticketList = tickets.map(ticket => {
      if(!ticket.orderId) {
        return (
          <tr key={ticket.id}>
                  <td>
                    <Link href={`/tickets/${ticket.id}`}>
                      {ticket.title}
                    </Link>
                    </td>
                  <td>{ticket.price}</td>
                </tr>
        )
      }
    });
    return (
      <>
        <div>
          <h1>Tickets</h1>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {ticketList}
            </tbody>
          </table>
        </div>
      </>  
    );
}

Home.getInitialProps = async (context, client, currentUser) => {
  const {data} = await client.get('/api/tickets');
  return {
    tickets: data.tickets
  };
}

export default Home;