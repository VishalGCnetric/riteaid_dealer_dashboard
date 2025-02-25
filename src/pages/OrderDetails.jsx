import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSingleOrder, updateOrderStatus } from "../slices/orderSlice";
import OrderProductTable from "../components/OrderProductTable";
import TaxSummary from "../components/TaxSummary";
import QRCodeComponent from "../components/QrCode";
import Breadcrumb from "../components/Breadcrumb";
import Loader from "../components/Loader";
import ConfirmationModal from "../components/ConformationModal";

import { cancelOrder, fetchOrderDetails, getAggregateDetails, getOrderLines, selectError, selectLoading, setFulfillment, setRefund, setState, settleRefund } from '../slices/neworderSlice';

const mutedFgClass = "text-muted-foreground dark:text-muted-foreground";
const inputClasses =
  "bg-input border text-sm border-border rounded-md py-2 px-3 pr-8 text-primary   focus:outline-none focus:ring focus:ring-primary focus:border-primary/80";
const textInputClasses =
  "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-input";
const formatCurrency = (amount) => {
  const currency = process.env.REACT_APP_CURRENCY || "INR";
  const symbol =
    currency === "USD"
      ? "$"
      : currency === "EUR"
      ? "€"
      : currency === "GBP"
      ? "£"
      : currency === "INR"
      ? "₹"
      : "";

  return `${symbol}${amount.toLocaleString()}`;
};

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState("");
  const [update, setUpdate] = useState(0);
  const [order, setOrder] = useState({});
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const [orderLines, setOrderLines] = useState();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let orderDetails = await dispatch(fetchOrderDetails(id)).unwrap();
        let neworderLines = await dispatch(getOrderLines(id)).unwrap();
        setOrderLines(neworderLines?.lines);
        setOrder(orderDetails);
        console.log("✅ Orders details fetched:", orderDetails, orderLines);
      } catch (error) {
        console.error("❌ Fetch error:", error);
      }
    };

    fetchOrders();
  }, [dispatch, id]);

  useEffect(() => {
    if (order && order.order && order.order.state) {
      setStatus(order.order.state);
    }
  }, [order]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setPendingStatus(newStatus);
    setIsModalOpen(true);
  };

  const cancelStatusChange = () => {
    setIsModalOpen(false);
  };

  const handleApprovalClick = async () => {
    try {
      let fulfillments = await dispatch(setFulfillment(orderLines)).unwrap();
      console.log("✅ Orders fulfillment:", fulfillments);
      let orderDetails = await dispatch(fetchOrderDetails(id)).unwrap();
      setOrder(orderDetails);
    } catch (error) {
      console.error("❌ Fetch error:", error);
    }
    setUpdate((pre) => pre + 1);
  };

  const confirmStatusChange = async () => {
    setStatus(pendingStatus);
    console.log(pendingStatus, order.order?.fulfillments);
    
    try {
      const fullfillmentId = order.order?.fulfillments?.[0]?.id;
      
      if (pendingStatus === "Cancelled") {
        let getAggregates = await dispatch(getAggregateDetails(id)).unwrap();
        let paymentId = getAggregates.order.payments[0].id || 34;
        let amount = getAggregates.order.totalWithTax;
        
        let setRefundResult = await dispatch(
          setRefund({ 
            orderLines, 
            amount, 
            paymentId 
          })
        ).unwrap();
        console.log("setrefundresult",setRefundResult)
        let transactionId = setRefundResult.refundOrder.transactionId || 342;
        let refundId=setRefundResult.refundOrder.id
        await dispatch(
          settleRefund({ 
            transactionId, 
            refundId
          })
        ).unwrap();
        
        await dispatch(cancelOrder(id)).unwrap();
      }

      await dispatch(
        setState({ 
          pendingStatus, 
          fullfillmentId 
        })
      ).unwrap();
      
      let orderDetail = await dispatch(fetchOrderDetails(id)).unwrap();
      setOrder(orderDetail);
    } catch (error) {
      console.error("❌ Fetch error:", error);
    }
    
    setIsModalOpen(false);
  };

  if (loading) {
    return <Loader />;
  }

  // if (error) {
  //   return <div className="p-4 text-red-600 bg-red-100 rounded-md">Error: {error}</div>;
  // }

  if (!order || !order.order) {
    return <Loader />;
  }

  const {
    customer,
    state,
    lines,
    total,
    subTotal,
    shipping,
    taxSummary,
    payments,
    shippingAddress,
    createdAt,
    updatedAt,
    nextStates,
    fulfillments,
    deliveryType,
    aggregateOrder
  } = order.order;

  const isApproved = fulfillments?.[0]?.id !== undefined;
  
  const getBadgeColor = () => {
    switch (aggregateOrder?.customFields?.deliveryType) {
      case "Standard Shipment":
        return "bg-blue-400 text-white";
      case "ship":
        return "bg-green-400 text-white";
      case "pickup":
        return "bg-orange-400 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };
  
  const discount =
    lines?.reduce((acc, el) => {
      return acc + el.linePrice;
    }, 0) - subTotal;

  return (
    <div className="p-2  bg-[#EAF1E0] dark:bg-black rounded-lg">
      <div className="mb-6">
        <Breadcrumb />
      </div>
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold dark:text-card-foreground">
          Order: #{id}
        </h2>
        <button
          onClick={handleApprovalClick}
          disabled={isApproved}
          className={`${
            isApproved
              ? " bg-[#a6bb7b] text-white"
              : "bg-[#7a9950] text-white dark:bg-primary-foreground dark:text-primary-foreground"
          } px-4 py-2 rounded-md`}
        >
          {isApproved ? "Approved" : "Approve"}
        </button>
      </div>
      <div className="flex flex-col-reverse md:flex-row">
        <div className="flex-grow md:mr-4">
          <div className="mt-6">
            <OrderProductTable
              items={lines?.map((line) => ({
                name: line.productVariant.name,
                sku: line.productVariant.sku,
                unitPrice: formatCurrency(line.linePrice),
                quantity: line.quantity,
                total: formatCurrency(line.linePrice),
                image: line?.productVariant?.featuredAsset?.preview,
              }))}
              summary={{
                totalDiscount: `- ${formatCurrency(discount)}`,
                subTotal: formatCurrency(subTotal),
                shipping: formatCurrency(shipping),
                total: formatCurrency(total),
              }}
            />
          </div>
          <div className="mt-6">
            <TaxSummary
              taxSummary={taxSummary?.map((tax) => ({
                description: tax.description,
                taxRate: `${tax.taxRate}%`,
                taxBase: formatCurrency(tax.taxBase),
                taxTotal: formatCurrency(tax.taxTotal),
              }))}
            />
          </div>
        </div>
        <div className="rounded-lg bg-card text-card-foreground dark:bg-card dark:text-card-foreground">
          <div className="p-4 mb-4 bg-card border border-border rounded-lg md:mt-6">
            <div className="text-muted font-semibold">Status</div>
            <hr />
            <div className={`flex items-center justify-between mt-2 `}>
              <select
                className={`w-full  ${inputClasses} ${
                  state === "Delivered"
                    ? "bg-green-100"
                    : state === "Shipped"
                    ? "bg-orange-100"
                    : state === "Cancelled"
                    ? "bg-red-200"
                    : "bg-blue-200"
                } px-4 py-2 font-semibold border  rounded ${
                  !isApproved ? "bg-gray-200 text-black " : ""
                }`}
                name="state"
                id="state"
                value={status}
                onChange={handleStatusChange}
                disabled={!isApproved}
              >
                <option value={state}>
                  {state === "PaymentSettled" ? "Payment Settled" : state}
                </option>
                {nextStates?.map((nextState, i) => (
                  <option
                    key={i}
                    value={nextState}
                  >
                    {nextState}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="p-4 bg-card border border-border rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Customer</h2>
            <hr />
            <div className="flex items-center my-4">
              <img
                alt="user-icon"
                src="https://openui.fly.dev/openui/24x24.svg?text=👤"
                className="w-6 h-6 mr-2"
              />
              <span className="text-primary font-medium">
                {customer?.firstName} {customer?.lastName}
              </span>
            </div>
            {shippingAddress?.company ? (
              <>
                <div className="flex items-center space-x-2">
                  <div>Delivery Type:</div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor()}`}
                  >
                    {aggregateOrder?.customFields?.deliveryType && aggregateOrder?.customFields?.deliveryType.charAt(0).toUpperCase() + aggregateOrder?.customFields?.deliveryType.slice(1)}
                  </span>
                </div>
                <h3 className="text-md font-semibold mb-1">Shipping address</h3>
                <hr />
                <p className="text-muted-foreground">
                  {shippingAddress?.company}
                  <br />
                  {shippingAddress?.streetLine1} {shippingAddress?.streetLine2}
                  <br />
                  {shippingAddress?.city}, {shippingAddress?.province}{" "}
                  {shippingAddress?.postalCode}
                  <br />
                  📍 {shippingAddress?.country}
                  <br />
                  📞 {shippingAddress?.phoneNumber}
                </p>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <div>Delivery Type:</div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor()}`}
                >
                  {deliveryType && deliveryType.charAt(0).toUpperCase() + deliveryType.slice(1)}
                </span>
              </div>
            )}
          </div>
          <div className="my-4 p-4 rounded-lg border border-border">
            <h2 className="text-lg pb-2 font-semibold">Payments</h2>
            <hr />
            <div className="bg-card mt-2 text-muted-foreground dark:bg-card dark:text-muted-foreground">
              <div className="flex justify-between">
                <p>
                  Payment{" "}
                  <span className="font-semibold text-primary dark:text-primary">
                    {formatCurrency(payments?.[0]?.amount || 0)}
                  </span>
                </p>
                <p>
                  <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-full dark:bg-green-500 dark:text-white">
                    Settled
                  </span>
                </p>
              </div>
              <p>Payment method: {payments?.[0]?.method || 'N/A'}</p>
              <p>
                Amount:{" "}
                <span className="font-semibold dark:text-primary">
                  {formatCurrency(payments?.[0]?.amount || 0)}
                </span>
              </p>
              <p>
                Transaction ID:{" "}
                <span className="font-semibold">
                  {payments?.[0]?.transactionId || 'N/A'}
                </span>
              </p>
            </div>
          </div>
          <div
            className={`rounded-lg border border-border p-4 ${mutedFgClass}`}
          >
            <p className="py-2">
              ID: <span className="font-semibold">{id}</span>
            </p>
            <hr />
            <p className="pt-2">
              Created at:{" "}
              <span className="font-semibold">
                {new Date(createdAt).toLocaleString()}
              </span>
            </p>
            <p>
              Updated at:{" "}
              <span className="font-semibold">
                {new Date(updatedAt).toLocaleString()}
              </span>
            </p>
            {/* <QRCodeComponent orderId={id} /> */}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmStatusChange}
        onCancel={cancelStatusChange}
        message={`Are you sure you want to change the order status to "${pendingStatus}"?`}
        status={pendingStatus}
      />
    </div>
  );
};

export default OrderDetails;