import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import OrderDetails from '../pages/OrderDetails';

const BASE_URL = 'https://m100003239002.demo-hclvoltmx.net/services/DealerVendureApi';

// Get tokens from localStorage with extra checks
const getTokens = () => {
  try {
    const vendureAuthToken = localStorage.getItem('vendureAuthToken');
    const voltmxToken = localStorage.getItem('voltmxToken');
    const channelToken = localStorage.getItem('channelToken');
    const adminToken = localStorage.getItem('adminToken');

    if (!vendureAuthToken || !voltmxToken ||!channelToken ||!adminToken) {
      console.warn('Authentication tokens missing in localStorage');
      return null;
    }
    return { vendureAuthToken, voltmxToken, channelToken, adminToken };
  } catch (error) {
    console.error('Error retrieving tokens from localStorage:', error);
    return null;
  }
};

// Helper function for making API requests
const fetchOrders = async (endpoint, body = null) => {
    const tokens = getTokens();
    if (!tokens) throw new Error('Authentication tokens not found');
  
    const { vendureAuthToken, voltmxToken, channelToken ,adminToken} = tokens;
    console.log(`Fetching ${endpoint} orders...`); // Debugging log
    const newtoken=endpoint=="orderDetails"?adminToken:vendureAuthToken;
  
    try {
      const response = await axios.post(`${BASE_URL}/${endpoint}`, body, {
        headers: {
          'Vendure-Token': channelToken,
          'Accept': 'application/json',
          'Authorization': `Bearer ${newtoken}`,
          'X-Voltmx-Authorization': voltmxToken,
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);

      if (!response.data || !response.data.data) {
        console.warn(`No valid data received from ${endpoint} API`);
        throw new Error('No data received');
      }
      
      if (endpoint === "orderDetails") {
        const orders = response.data.data;
        console.log(`✅ Extracted order details:`, orders); // Debugging log
        return orders;
      } else {
        const orders = response.data.data.orders?.items || [];
        console.log(`✅ Extracted orders:`, orders); // Debugging log
        return orders; // Ensure we return only `items`
      }
    } catch (error) {
      console.error(`❌ Error fetching ${endpoint} orders:`, error.response?.data || error.message);
      throw error;
    }
};

// Fetch all orders
export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchOrders('orders');
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Fetch completed orders
export const fetchCompletedOrders = createAsyncThunk(
  'orders/fetchCompleted',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchOrders('completed');
    } catch (error) {
      console.error('Error fetching completed orders:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Fetch pending orders
export const fetchPendingOrders = createAsyncThunk(
  'orders/fetchPending',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchOrders('pending');
    } catch (error) {
      console.error('Error fetching pending orders:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Fetch cancelled orders
export const fetchCancelledOrders = createAsyncThunk(
  'orders/fetchCancelled',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchOrders('cancelled');
    } catch (error) {
      console.error('Error fetching cancelled orders:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Fetch order details
export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchDetails',
  async (orderId, { rejectWithValue }) => {
    try {
      return await fetchOrders('orderDetails', { OrderID: orderId });
    } catch (error) {
      console.error('Error fetching order details:', error);
      return rejectWithValue(error.message);
    }
  }
);

const newfetchOrders = async (endpoint, body = null) => {
    const tokens = getTokens();
    if (!tokens) throw new Error('Authentication tokens not found');
    
    console.log(body, "request body");
    
    const { vendureAuthToken, voltmxToken, channelToken, adminToken } = tokens;
    console.log(`Fetching ${endpoint} orders...`); // Debugging log
    
    const authtoken = `Bearer ${endpoint === "setState" || endpoint === "getAggregateDetails" || 
                      endpoint === "setRefund" || endpoint === "settleRefund" || 
                      endpoint === "cancelorder" ? adminToken : vendureAuthToken}`;
    
    try {
      const response = await axios.post(`${BASE_URL}/${endpoint}`, body, {
        headers: {
          'Vendure-Token': channelToken,
          'Accept': 'application/json',
          'Authorization': authtoken,
          'X-Voltmx-Authorization': voltmxToken,
          'Content-Type': 'application/json',
        },
      });
      
      console.log(response.data);
      
      if (!response.data || !response.data.data) {
        console.warn(`No valid data received from ${endpoint} API`);
        throw new Error('No data received');
      }
      
      if (endpoint === "setFulfillment") {
        const orders = response.data.data || [];
        console.log(`✅ Extracted setfulfillment:`, orders);
        return orders;
      } else if (endpoint === "getOrderLines") {
        const orders = response.data.data.order;
        console.log(`✅ Extracted order lines:`, orders); // Debugging log
        return orders;
      } else if (endpoint === "orderDetails") {
        const orders = response.data.data;
        console.log(`✅ Extracted order details:`, orders); // Debugging log
        return orders;
      } else if (endpoint === "setRefund" || endpoint === "settleRefund" || endpoint === "setState" ||
                endpoint === "cancelorder" || endpoint === "getAggregateDetails") {
        return response.data.data;
      } else {
        const orders = response.data.data.orders.items || [];
        console.log(`✅ Extracted orders:`, orders); // Debugging log
        return orders; // Ensure we return only `items`
      }
    } catch (error) {
      console.error(`❌ Error fetching ${endpoint} orders:`, error.response?.data || error.message);
      throw error;
    }
};

// New thunks for additional operations
export const getOrderLines = createAsyncThunk(
  'orders/getOrderLines',
  async (orderId, { rejectWithValue }) => {
    try {
      return await newfetchOrders('getOrderLines', { orderID: orderId });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const setFulfillment = createAsyncThunk(
  'orders/setFulfillment',
  async (orderLines, { rejectWithValue }) => {
    try {
      return await newfetchOrders('setFulfillment', { orderLines });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getFulfillmentId = createAsyncThunk(
  'orders/getFulfillmentId',
  async (orderId, { rejectWithValue }) => {
    try {
      return await newfetchOrders('getFulfillmentID', { orderID: orderId });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const setState = createAsyncThunk(
  'orders/setState',
  async ({ pendingStatus, fullfillmentId }, { rejectWithValue }) => {
    try {
      return await newfetchOrders('setState', { State: pendingStatus, Id: fullfillmentId });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAggregateDetails = createAsyncThunk(
  'orders/getAggregateDetails',
  async (id, { rejectWithValue }) => {
    try {
      return await newfetchOrders('getAggregateDetails', { orderID: id });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const setRefund = createAsyncThunk(
  'orders/setRefund',
  async ({ orderLines, amount, paymentId }, { rejectWithValue }) => {
    try {
      return await newfetchOrders('setRefund', { 
        orderLines,
        Amount: amount,
        PaymentId: paymentId
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const settleRefund = createAsyncThunk(
  'orders/settleRefund',
  async ({ transactionId, refundId }, { rejectWithValue }) => {
    try {
      return await newfetchOrders('settleRefund', { 
        transactionID: transactionId,
        ID: refundId
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (id, { rejectWithValue }) => {
    try {
      return await newfetchOrders('cancelorder', { orderID: id });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    allOrders: [],
    completedOrders: [],
    pendingOrders: [],
    cancelledOrders: [],
    currentOrder: null,
    orderLines: null,
    fulfillmentId: null,
    aggregateDetails: null,
    loading: false,
    error: null,
    currentStatus: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentStatus: (state, action) => {
      state.currentStatus = action.payload;
    },
    resetCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(fetchAllOrders.pending, (state) => {
        console.log('Fetching all orders...'); 
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload || []; // Ensure orders are an array
        console.log("📦 Stored orders in Redux:", state.allOrders);
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        console.error('Fetch all orders failed:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch completed orders
      .addCase(fetchCompletedOrders.pending, (state) => {
        console.log('Fetching completed orders...');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompletedOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.completedOrders = action.payload || [];
      })
      .addCase(fetchCompletedOrders.rejected, (state, action) => {
        console.error('Fetch completed orders failed:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch pending orders
      .addCase(fetchPendingOrders.pending, (state) => {
        console.log('Fetching pending orders...');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingOrders = action.payload || [];
      })
      .addCase(fetchPendingOrders.rejected, (state, action) => {
        console.error('Fetch pending orders failed:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch cancelled orders
      .addCase(fetchCancelledOrders.pending, (state) => {
        console.log('Fetching cancelled orders...');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCancelledOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.cancelledOrders = action.payload || [];
      })
      .addCase(fetchCancelledOrders.rejected, (state, action) => {
        console.error('Fetch cancelled orders failed:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch order details
      .addCase(fetchOrderDetails.pending, (state) => {
        console.log('Fetching order details...');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        console.error('Fetch order details failed:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(getOrderLines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderLines.fulfilled, (state, action) => {
        state.loading = false;
        state.orderLines = action.payload;
      })
      .addCase(getOrderLines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(setFulfillment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setFulfillment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(setFulfillment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(getFulfillmentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFulfillmentId.fulfilled, (state, action) => {
        state.loading = false;
        state.fulfillmentId = action.payload;
      })
      .addCase(getFulfillmentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(setState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setState.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(setState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(getAggregateDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAggregateDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.aggregateDetails = action.payload;
      })
     
      .addCase(getAggregateDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(setRefund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setRefund.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(setRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(settleRefund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(settleRefund.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(settleRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export existing actions and selectors...
export const { clearError, setCurrentStatus, resetCurrentOrder } = orderSlice.actions;

// New selectors for additional state
export const selectOrderLines = (state) => state.orders.orderLines;
export const selectFulfillmentId = (state) => state.orders.fulfillmentId;
export const selectAggregateDetails = (state) => state.orders.aggregateDetails;

// Export existing selectors...
export const selectAllOrders = (state) => state.orders.allOrders;
export const selectCompletedOrders = (state) => state.orders.completedOrders;
export const selectPendingOrders = (state) => state.orders.pendingOrders;
export const selectCancelledOrders = (state) => state.orders.cancelledOrders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectLoading = (state) => state.orders.loading;
export const selectError = (state) => state.orders.error;
export const selectCurrentStatus = (state) => state.orders.currentStatus;

export default orderSlice.reducer;