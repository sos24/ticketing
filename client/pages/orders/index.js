import Link from "next/link";

const Orders = ({user, orders}) => {
    let ordersList = [];

    if (orders) {
      ordersList = orders.map(order => {
        return (
          <tr key={order.id}>
              <td>
                  <Link href={`/orders/${order.id}`}>
                  {order.id}
                  </Link>
              </td>
              <td>{order.ticket.title}</td>
              <td>{order.ticket.price}</td>
              <td>{order.status}</td>
          </tr>
        )
      });
    }
    return (
      <>
        <div>
          <h1>Orders </h1>
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Title</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ordersList}
            </tbody>
          </table>
        </div>
      </>  
    );
}

Orders.getInitialProps = async (context, client, currentUser) => {
  let orders = [];
  try {
    const {data} = await client.get('/api/orders');
    orders = data.orders
  } catch (e) {
  }
  return {
    orders
  };
}

export default Orders;