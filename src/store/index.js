import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// Reducers
import userReducer from "../pages/client-customer/ProfilePage/userSlice";
import bookingReducer from "../pages/client-customer/BookingPage/bookingSlice";
import commentReducer from "../pages/client-customer/RoomDetailPage/commentSlice";
import roomDetailReducer from "../pages/client-customer/RoomDetailPage/roomDetailSlice";
import authReducer from "../pages/client-customer/LoginPage/authSlice";
import roomListReducer from "../pages/client-customer/RoomListPage/RoomListSlice";
import adminUserReducer from "../pages/client-admin/UserManager/adminUserSlice";
import adminRoomReducer from "../pages/client-admin/RoomManager/adminRoomSlice";
import adminBookingReducer from "../pages/client-admin/BookingManager/adminBookingSlice";
import adminCommentReducer from "../pages/client-admin/CommentManager/adminCommentSlice";
import adminLoginReducer from "../pages/client-admin/AuthPage/authSlice";
import locationReducer from "../pages/client-admin/LocationManager/locationSlice";
import themeReducer from "./themeSlice";

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  adminlogin: adminLoginReducer, // Thêm reducer cho admin login
  user: userReducer,
  booking: bookingReducer,
  comment: commentReducer,
  roomList: roomListReducer,
  roomDetail: roomDetailReducer,
  theme: themeReducer, // Thêm theme reducer

  userList: adminUserReducer, // Đổi tên từ adminUser thành userList để khớp với component
  adminRoom: adminRoomReducer,
  adminBooking: adminBookingReducer,
  adminComment: adminCommentReducer,
  location: locationReducer, // Thêm location reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable warning
    }),
});

export const persistor = persistStore(store);
