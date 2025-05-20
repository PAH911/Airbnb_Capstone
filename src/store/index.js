import { configureStore } from "@reduxjs/toolkit";

// USER
import userReducer from "../pages/client-customer/ProfilePage/userSlice";
import bookingReducer from "../pages/client-customer/BookingPage/bookingSlice";
import commentReducer from "../pages/client-customer/RoomDetailPage/commentSlice";
import roomDetailReducer from "../pages/client-customer/RoomDetailPage/roomDetailSlice";
import authReducer from "../pages/client-customer/LoginPage/authSlice";

// ADMIN
import adminUserReducer from "../pages/client-admin/UserManager/adminUserSlice";
import adminRoomReducer from "../pages/client-admin/RoomManager/adminRoomSlice";
import locationReducer from "../pages/client-admin/LocationManager/locationSlice";
import adminBookingReducer from "../pages/client-admin/BookingManager/adminBookingSlice";
import adminCommentReducer from "../pages/client-admin/CommentManager/adminCommentSlice";

export const store = configureStore({
  reducer: {
    // client-customer
    auth: authReducer,
    user: userReducer,
    booking: bookingReducer,
    comment: commentReducer,
    roomDetail: roomDetailReducer,

    // client-admin
    adminUser: adminUserReducer,
    adminRoom: adminRoomReducer,
    location: locationReducer,
    adminBooking: adminBookingReducer,
    adminComment: adminCommentReducer,
  },
});
