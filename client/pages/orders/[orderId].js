import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from "../../hooks/useRequest";

const Order = ({order, currentuser}) => {
    
    const [timeLeft, setTimeLeft] = useState(0);
    const { doRequest, errors} = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id,
        },
        onSucces: (payment) => console.log(payment)
    });
    useEffect(() => {
       if (order) {
            const findTimeLeft = () => {
                const msLeft = new Date(order.expiresAt) - new Date();
                setTimeLeft(Math.round(msLeft/1000))
            }
            findTimeLeft();
            const timerId = setInterval(findTimeLeft, 1000);
            return () => {
                clearInterval(timerId);
            }
       }
    }, []);
    
    if (!order || (timeLeft < 0 && order.status !== 'complete')) {
        return <div>Order expired</div>
    }
    if (errors) {
        return <div>errors</div>
    }
    return (
      <>
        {order && 
            <div>
                <div>Order id < h4>{order.id}</h4></div>
                <div>Title <h4>{order.ticket.title}</h4></div>
                <div>Price <h4>{order.ticket.price}</h4></div>
                <div>Status <h4>{order.status}</h4></div>
                {order.status !== 'complete' && <><div>Expires at <h4>{timeLeft}</h4></div><StripeCheckout
                    token={({id}) => doRequest({token: id})}
                    stripeKey="pk_test_51NLLHUCb5IoHRQkPCHeGTRFRi7xI7wa02kpxnfencM5WGTGxE1pfHNEsxA6EcnV1MVclgABA7odm3ody2AxB0JDC00vHivRUe5"
                    amount={order.ticket.price*100}
                    email={currentuser.email}
                /></>}
            </div>
        }
      </>  
    );
}

Order.getInitialProps = async (context, client, currentuser) => {
    let order = null;
    try {
        const { orderId } = context.ctx.query;
        const response = await client.get(`/api/orders/${orderId}`);
        if (response.data.order) {
            order = { ...response.data.order };
        }
    } catch(e) {
        console.log(e)
    }
    return {
        order,
        currentuser
    }
}

export default Order;