import React, { useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import OrderList from './OrderList';
import Loader from './Loader';
import { fetchAllOrders, selectAllOrders, selectLoading, selectError } from '../slices/neworderSlice';

const OrderListComponent = () => {
  const dispatch = useDispatch();
  let [allOrders,setAllOrders]=useState([]);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  console.log("📝 Orders:", allOrders, "⏳ Loading:", loading, "❌ Error:", error);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let allOrder = await dispatch(fetchAllOrders()).unwrap(); // Use `.unwrap()` to get the payload directly
        setAllOrders(allOrder)
        console.log("✅ Orders fetched:", allOrder);
      } catch (error) {
        console.error("❌ Fetch error:", error);
      }
    };

    fetchOrders();
  }, [dispatch]);

  return (
    <div>
      {loading && <Loader />}
      {/* {error && <p className="text-red-500">Error: {error}</p>} */}
      {/* {!loading && !error && allOrders?.length === 0 && <p>No orders found.</p>} */}
      {!loading && allOrders?.length > 0 && (
        <OrderList Heading="All Orders" show={true} customerOrders={allOrders} />
      )}
    </div>
  );
};

export default OrderListComponent;
