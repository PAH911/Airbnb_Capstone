import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";

// Reducers
import userReducer from "../pages/client-customer/ProfilePage/userSlice";
import bookingReducer from "../pages/client-customer/BookingPage/bookingSlice";
import commentReducer from "../pages/client-customer/RoomDetailPage/commentSlice";
import roomDetailReducer from "../pages/client-customer/RoomDetailPage/roomDetailSlice";
import authReducer from "../pages/client-customer/LoginPage/authSlice";

import adminUserReducer from "../pages/client-admin/UserManager/adminUserSlice";
import adminRoomReducer from "../pages/client-admin/RoomManager/adminRoomSlice";
import locationReducer from "../pages/client-admin/LocationManager/locationSlice";
import adminBookingReducer from "../pages/client-admin/BookingManager/adminBookingSlice";
import adminCommentReducer from "../pages/client-admin/CommentManager/adminCommentSlice";

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // 👈 chỉ lưu auth, tránh lưu dư thừa
};

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
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);
