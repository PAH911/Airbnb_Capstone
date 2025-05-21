import { configureStore } from "@reduxjs/toolkit";

// USER
import userReducer from "../pages/client-customer/ProfilePage/userSlice";
import bookingReducer from "../pages/client-customer/BookingPage/bookingSlice";
import commentReducer from "../pages/client-customer/RoomDetailPage/commentSlice";
import roomDetailReducer from "../pages/client-customer/RoomDetailPage/roomDetailSlice";
import authReducer from "../pages/client-customer/LoginPage/authSlice";

// ADMIN
import authadminReducer from "../pages/client-admin/AuthPage/authSlice";
import adminRoomReducer from "../pages/client-admin/RoomManager/adminRoomSlice";
import locationReducer from "../pages/client-admin/LocationManager/locationSlice";
import adminBookingReducer from "../pages/client-admin/BookingManager/adminBookingSlice";
import adminCommentReducer from "../pages/client-admin/CommentManager/adminCommentSlice";
import userListReducer from "../pages/client-admin/UserManager/adminUserSlice";


export const store = configureStore({
  reducer: {
    // client-customer
    auth: authReducer,
    user: userReducer,
    booking: bookingReducer,
    comment: commentReducer,
    roomDetail: roomDetailReducer,

    // client-admin
    adminlogin: authadminReducer,
    userList: userListReducer,
    adminRoom: adminRoomReducer,  
    location: locationReducer,
    adminBooking: adminBookingReducer,
    adminComment: adminCommentReducer,
  },
});
