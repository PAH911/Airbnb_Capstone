import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { thunk } from "redux-thunk";

// Reducers
import userReducer from "../pages/client-customer/ProfilePage/userSlice";
import bookingReducer from "../pages/client-customer/BookingPage/bookingSlice";
import commentReducer from "../pages/client-customer/RoomDetailPage/commentSlice";
import roomDetailReducer from "../pages/client-customer/RoomDetailPage/roomDetailSlice";
import authReducer from "../pages/client-customer/LoginPage/authSlice";

<<<<<<< HEAD
// ADMIN
import authadminReducer from "../pages/client-admin/AuthPage/authSlice";
=======
import adminUserReducer from "../pages/client-admin/UserManager/adminUserSlice";
>>>>>>> 33567a28a23576b063f70fdf8550d6149e6d77a1
import adminRoomReducer from "../pages/client-admin/RoomManager/adminRoomSlice";
import locationReducer from "../pages/client-admin/LocationManager/locationSlice";
import adminBookingReducer from "../pages/client-admin/BookingManager/adminBookingSlice";
import adminCommentReducer from "../pages/client-admin/CommentManager/adminCommentSlice";
import userListReducer from "../pages/client-admin/UserManager/adminUserSlice";


// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // 👈 chỉ lưu auth, tránh lưu dư thừa
};

<<<<<<< HEAD
    // client-admin
    adminlogin: authadminReducer,
    userList: userListReducer,
    adminRoom: adminRoomReducer,  
    location: locationReducer,
    adminBooking: adminBookingReducer,
    adminComment: adminCommentReducer,
  },
=======
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  booking: bookingReducer,
  comment: commentReducer,
  roomDetail: roomDetailReducer,

  adminUser: adminUserReducer,
  adminRoom: adminRoomReducer,
  location: locationReducer,
  adminBooking: adminBookingReducer,
  adminComment: adminCommentReducer,
>>>>>>> 33567a28a23576b063f70fdf8550d6149e6d77a1
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
