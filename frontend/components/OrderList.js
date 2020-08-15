import React from 'react'
import { Query } from 'react-apollo'
import { formatDistance } from 'date-fns'
import Link from 'next/link'
import styled from 'styled-components'
import gql from 'graphql-tag'
import formatMoney from '../lib/formatMoney'
import OrderItemStyles from './styles/OrderItemStyles'
import Error from './ErrorMessage'

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    orders(orderBy: cat_DESC) {
      id
      total
      cat
      items {
        id
        title
        price
        description
        quantity
        image
      }
    }
  }
`

const orderUl = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`

class OrderList extends React.Component {
  render() {
    return (
      <Query query={USER_ORDERS_QUERY}>
        {({ data: { orders }, loading, error }) => {
          if (loading) return <p>loading...</p>
          if (error) return <Error error={error} />
          return (
            <>
              <h2>You have {orders.length} orders</h2>
              <orderUl>
                {orders.map(order => (
                  <OrderItemStyles>
                    <Link
                      href={{ pathname: '/order', query: { id: order.id } }}
                    >
                      <a>
                        <div className="order-meta">
                          <p>
                            {order.items &&
                              order.items.reduce((a, b) => a + b.quantity, 0)}
                            Items
                          </p>
                          <p>{formatDistance(order.cat, new Date())}</p>
                          <p>{formatMoney(order.total)}</p>
                        </div>
                        <div className="images">
                          {order.items.map(item => (
                            <img
                              key={item.id}
                              src={item.image}
                              alt={item.title}
                            />
                          ))}
                        </div>
                      </a>
                    </Link>
                  </OrderItemStyles>
                ))}
              </orderUl>
            </>
          )
        }}
      </Query>
    )
  }
}

export default OrderList
