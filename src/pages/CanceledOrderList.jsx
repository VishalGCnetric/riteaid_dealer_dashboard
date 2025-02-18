import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCancelledOrders, selectError, selectLoading } from '../slices/neworderSlice'; // Import the action
import OrderList from '../components/OrderList';
import Loader from '../components/Loader';

const CanceledOrderList = () => {
  const dispatch = useDispatch();
  let [allOrders,setAllOrders]=useState([]);
const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  // Get orders and loading/error state from Redux

  // Dispatch action to fetch all orders when the component mounts
  useEffect(() => {
     const fetchOrders = async () => {
       try {
         let allOrder = await dispatch(fetchCancelledOrders()).unwrap(); // Use `.unwrap()` to get the payload directly
         setAllOrders(allOrder)
         console.log("✅ Orders fetched: in effect", allOrder);
       } catch (error) {
         console.error("❌ Fetch error:", error);
       }
     };
 
     fetchOrders();
   }, [dispatch]);

  // Handle loading and error states
  if (loading) {
    return <Loader/>;
  }

  // if (error) {
  //   return <div>Error fetching orders: {error}</div>;
  // }

  return (
    <OrderList Heading="Canceled Orders" show={false} customerOrders={allOrders} />
  );
};

export default CanceledOrderList;
