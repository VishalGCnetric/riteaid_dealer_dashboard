import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// API Base URLs
const BASE_URL = 'https://m100003239002.demo-hclvoltmx.net/services/DealerVendureApi';
const AUTH_URL = 'https://m100003239002.demo-hclvoltmx.net/services/InvokeFoundryService';

// API Keys
const API_KEYS = {
  APP_KEY: '70a7f7506de3d432a9042da810f76cb9',
  APP_SECRET: '77b51c030ab8d3dac99f6f7d61b1b971'
};

// Local Storage Keys
const STORAGE_KEYS = {
    VENDURE_AUTH_TOKEN: 'vendureAuthToken',
    SELLER_ID: 'sellerId',
    CHANNEL_TOKEN: 'channelToken',
    VOLTMX_TOKEN: 'voltmxToken',
    ADMIN_TOKEN: 'adminToken'
  };

// Get Voltmx Token
export const getVoltmxToken = createAsyncThunk(
    'seller/getVoltmxToken',
    async () => {
      const response = await fetch(`${AUTH_URL}/TokenLogin`, {
        method: 'POST',
        headers: {
          'X-Voltmx-app-key': API_KEYS.APP_KEY,
          'X-Voltmx-app-secret': API_KEYS.APP_SECRET,
          'Accept': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to get Voltmx token');
      }
  
      const data = await response.json();
      console.log('Voltmx Token Response:', data);
  
      const voltmxToken = data.claims_token?.value || data.refresh_token;
      
      if (!voltmxToken) {
        throw new Error('Invalid response: No token received');
      }
  
      localStorage.setItem(STORAGE_KEYS.VOLTMX_TOKEN, voltmxToken);
      return voltmxToken;
    }
  );
  
// Helper function to handle token refresh and retry
const executeWithTokenRefresh = async (thunkAPI, apiCall) => {
    try {
      return await apiCall();
    } catch (error) {
      console.error('API Call Error:', error);
      
      if (error.message.includes('Token Expired') || error.message.includes('unauthorized')) {
        try {
          console.log('Refreshing token...');
          const newToken = await thunkAPI.dispatch(getVoltmxToken()).unwrap();
          
          if (newToken) {
            localStorage.setItem(STORAGE_KEYS.VOLTMX_TOKEN, newToken);
          } else {
            throw new Error('Token refresh failed: No new token received');
          }
          
          return await apiCall(); // Retry with new token
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          throw new Error('Token refresh failed: ' + refreshError.message);
        }
      }
      
      throw error;
    }
  };
  

export const sellerLogin = createAsyncThunk(
    'seller/login',
    async (credentials, thunkAPI) => {
      const apiCall = async () => {
        const voltmxToken = localStorage.getItem(STORAGE_KEYS.VOLTMX_TOKEN);
        
        const response = await fetch(`${BASE_URL}/SellerLogin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Voltmx-Authorization': voltmxToken,
            
          },
          body: JSON.stringify(credentials),
            // credentials: "include",
            //  // Allow cookies and auth headers
//   cache: "no-store"
        });
  
        console.log("Response Headers:", [...response.headers.entries()]); // Log headers
  
        if (!response.ok) {
          throw new Error('Login failed');
        }
        
        const vendureAuthToken = response.headers.get('vendure-auth-token')||"e6278ee56e6458ed9c487c190de34a11945d063a5d81eb0768f9eaaa26af9085";
// Check if it's present
        console.log("Vendure Auth Token from Headers:", vendureAuthToken);
  
        if (vendureAuthToken) {
          localStorage.setItem(STORAGE_KEYS.VENDURE_AUTH_TOKEN, vendureAuthToken || "9403075259a84e419375c22350b5d432d7bf4dc2f4aaec92237de531321225bc");
        } else {
          console.warn("vendure-auth-token not found in response headers.");
        }
  
        const data = await response.json();
        

        console.log("All Headers:", [...response.headers.entries()]);
        console.log("Vendure Auth Token:", response.headers.get('vendure-auth-token'));
  console.log(data,"responsedata")
        const { login } = data?.data;
        
        const channelToken = login.channels[0].token;
        localStorage.setItem(STORAGE_KEYS.CHANNEL_TOKEN, channelToken);
        
        return {
          sellerId: login.id,
          identifier: login.identifier,
          channelToken,
          vendureAuthToken
        };
      };
  
      return executeWithTokenRefresh(thunkAPI, apiCall);
    }
  );
  

export const getSellerIdByToken = createAsyncThunk(
  'seller/getSellerIdByToken',
  async (_, thunkAPI) => {
    const apiCall = async () => {
      const vendureAuthToken = localStorage.getItem(STORAGE_KEYS.VENDURE_AUTH_TOKEN);
      const channelToken = localStorage.getItem(STORAGE_KEYS.CHANNEL_TOKEN);
      const voltmxToken = localStorage.getItem(STORAGE_KEYS.VOLTMX_TOKEN);
console.log(vendureAuthToken,channelToken,voltmxToken)
      if (!vendureAuthToken || !channelToken) {
        throw new Error('Authentication tokens not found');
      }

      const response = await fetch(`${BASE_URL}/GetSellerIDByToken`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${vendureAuthToken}`,
          'vendure-token': channelToken,
          'X-Voltmx-Authorization': voltmxToken,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to get seller ID');
      }
      
      const data = await response.json();
      console.log(data)
      const { me } = data.data;
      
      localStorage.setItem(STORAGE_KEYS.SELLER_ID, me.channels[0].id);
      
      return {
        identifier: me.identifier,
        sellerId: me.channels[0].id
      };
    };

    return executeWithTokenRefresh(thunkAPI, apiCall);
  }
);


// Get Admin Token
export const getAdminToken = createAsyncThunk(
    'seller/getAdminToken',
    async () => {
      const response = await fetch(`https://m100003239002.demo-hclvoltmx.net/services/VendureApis/AdminLogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
            "adminName": "superadmin",
            "adminPassword": "superadmin"
          })
      });
  
      if (!response.ok) {
        throw new Error('Failed to get admin token');
      }
     const adminToken= response.headers.get('vendure-auth-token') || "e7e609b52b20ae5dc6d22cfe592bdd05701ab6afcefaf1a72ae1939660df2556";
      const data = await response.json();
      console.log(data,adminToken,"admin")
    //   const adminToken = data.data.login?.channels?.[0].token 
      
      if (adminToken) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, adminToken);
      }
  
      return adminToken;
    }
  );
  
  // Previous code remains the same up until getSellerDetails...
  
  export const getSellerDetails = createAsyncThunk(
    'seller/getSellerDetails',
    async (_, thunkAPI) => {
      const apiCall = async () => {
        const vendureAuthToken = localStorage.getItem(STORAGE_KEYS.VENDURE_AUTH_TOKEN);
        const voltmxToken = localStorage.getItem(STORAGE_KEYS.VOLTMX_TOKEN);
        const adminToken = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
        const sellerId = localStorage.getItem(STORAGE_KEYS.SELLER_ID) || 3;
  
        if (!vendureAuthToken || !sellerId || !adminToken) {
          throw new Error('Required tokens or seller ID not found');
        }
  
        const response = await fetch(`${BASE_URL}/GetSellerDetails`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
            'X-Voltmx-Authorization': voltmxToken,
          },
          body: JSON.stringify({ seller_id: sellerId }),
        });
  
        console.log(response, "API Response");
  
        if (response.status === 401) {
          throw new Error('Unauthorized - Token may have expired');
        }
  
        if (!response.ok) {
          throw new Error('Failed to get seller details');
        }
  
        return response.json();
      };
  
      // Refresh token only if needed
      return executeWithTokenRefresh(thunkAPI, apiCall);
    }
  );
  
  
  const sellerSlice = createSlice({
    name: 'seller',
    initialState: {
      isAuthenticated: false,
      vendureAuthToken: localStorage.getItem(STORAGE_KEYS.VENDURE_AUTH_TOKEN),
      channelToken: localStorage.getItem(STORAGE_KEYS.CHANNEL_TOKEN),
      voltmxToken: localStorage.getItem(STORAGE_KEYS.VOLTMX_TOKEN),
      adminToken: localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN),
      sellerId: localStorage.getItem(STORAGE_KEYS.SELLER_ID),
      identifier: null,
      channelId: null,
      sellerDetails: null,
      loading: false,
      error: null,
    },
    reducers: {
      logout: (state) => {
        state.isAuthenticated = false;
        state.vendureAuthToken = null;
        state.channelToken = null;
        state.voltmxToken = null;
        state.adminToken = null;
        state.sellerId = null;
        state.identifier = null;
        state.channelId = null;
        state.sellerDetails = null;
        state.error = null;
        
        Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
      },
      clearError: (state) => {
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        // Admin Token cases
        .addCase(getAdminToken.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getAdminToken.fulfilled, (state, action) => {
          state.loading = false;
          state.adminToken = action.payload;
        })
        .addCase(getAdminToken.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })


      // Voltmx Token cases
      .addCase(getVoltmxToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVoltmxToken.fulfilled, (state, action) => {
        state.loading = false;
        state.voltmxToken = action.payload;
      })
      .addCase(getVoltmxToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Seller Login cases
      .addCase(sellerLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sellerLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.vendureAuthToken = action.payload.vendureAuthToken;
        state.channelToken = action.payload.channelToken;
        state.sellerId = action.payload.sellerId;
        state.identifier = action.payload.identifier;
      })
      .addCase(sellerLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Get Seller ID cases
      .addCase(getSellerIdByToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSellerIdByToken.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerId = action.payload.sellerId;
        state.identifier = action.payload.identifier;
        state.channelId = action.payload.channelId;
      })
      .addCase(getSellerIdByToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Get Seller Details cases
      .addCase(getSellerDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSellerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerDetails = action.payload;
      })
      .addCase(getSellerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout, clearError } = sellerSlice.actions;
export default sellerSlice.reducer;