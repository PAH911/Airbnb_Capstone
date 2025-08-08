import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin, clearError } from "./authSlice"; // đổi path đúng nếu khác
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiUser, FiLock, FiKey } from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Sửa lỗi destructure khi state.adminlogin chưa khởi tạo
  const adminlogin = useSelector((state) => state.adminlogin) || {
    user: null,
    loading: false,
    error: null,
  };
  const { user, loading, error } = adminlogin;

  const [form, setForm] = useState({ email: "", password: "" });
  const [focus, setFocus] = useState({ email: false, password: false });

  // Theo dõi user và error thay đổi
  useEffect(() => {
    console.log("🔄 UseEffect triggered");
    console.log("📊 Current user:", user);
    console.log("❌ Current error:", error);

    // Hiển thị lỗi nếu có
    if (error) {
      toast.error(error);
      return;
    }

    if (user) {
      const userRole = user.role || user.Role || user.ROLE;
      console.log("👤 User role:", userRole);

      // Kiểm tra quyền admin (case-insensitive)
      if (userRole && userRole.toLowerCase() === "admin") {
        console.log("✅ Admin role confirmed!");
        console.log("🚀 Navigating to /admin...");

        toast.success(`Chào mừng ${user.name || "Admin"}!`);

        // Sử dụng setTimeout để đảm bảo navigation hoạt động
        setTimeout(() => {
          navigate("/admin", { replace: true });
        }, 100);
      } else {
        console.log("❌ Not admin role:", userRole);
        toast.error("Bạn không có quyền truy cập admin!");
      }
    } else {
      console.log("👤 No user data yet");
    }
  }, [user, error, navigate]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error khi user bắt đầu nhập lại
    if (error) {
      dispatch(clearError());
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Clear localStorage trước khi đăng nhập
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");

    console.log("=== Starting login with ===", form);

    try {
      const res = await dispatch(loginAdmin(form));
      console.log("=== Full login result ===", res);

      // Kiểm tra kết quả đăng nhập
      if (res.meta.requestStatus === "fulfilled") {
        console.log(
          "✅ Login API successful, waiting for Redux and useEffect..."
        );
        // Redux slice sẽ xử lý user data và useEffect sẽ navigate
      } else {
        // Lỗi sẽ được xử lý bởi useEffect khi error state thay đổi
        console.log("❌ Login failed, error will be handled by useEffect");
      }
    } catch (error) {
      console.error("=== Login error ===", error);
      toast.error("Có lỗi xảy ra trong quá trình đăng nhập!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181c23] via-[#242c38] to-[#10131a]">
      <motion.div
        className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-[#212836] border border-[#31394e] relative"
        initial={{ y: 80, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.25 }}
      >
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-7"
        >
          <MdAdminPanelSettings className="text-5xl text-[#ffb92c] drop-shadow-glow" />
        </motion.div>
        <h2 className="text-2xl text-center font-bold text-[#ffb92c] tracking-wide mb-2">
          Đăng nhập Quản trị viên
        </h2>
        <p className="text-center text-[#a2adc7] mb-8">
          Chào mừng trở lại! Vui lòng nhập tài khoản admin để tiếp tục.
        </p>

        <form onSubmit={onSubmit} autoComplete="off">
          <div className="mb-5 relative">
            <FiUser
              className={`absolute left-3 top-1/2 -translate-y-1/2 text-xl transition-all ${
                focus.email ? "text-[#ffb92c]" : "text-[#a2adc7]"
              }`}
            />
            <input
              className={`w-full bg-[#232b3b] text-[#f4f6f8] pl-10 pr-4 py-3 rounded-lg outline-none border-2 transition
                ${
                  focus.email
                    ? "border-[#ffb92c] shadow-[0_0_0_2px_#ffb92c44]"
                    : "border-[#31394e]"
                }`}
              type="email"
              name="email"
              placeholder="Email quản trị"
              autoComplete="username"
              value={form.email}
              onFocus={() => setFocus((f) => ({ ...f, email: true }))}
              onBlur={() => setFocus((f) => ({ ...f, email: false }))}
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-7 relative">
            <FiLock
              className={`absolute left-3 top-1/2 -translate-y-1/2 text-xl transition-all ${
                focus.password ? "text-[#ffb92c]" : "text-[#a2adc7]"
              }`}
            />
            <input
              className={`w-full bg-[#232b3b] text-[#f4f6f8] pl-10 pr-4 py-3 rounded-lg outline-none border-2 transition
                ${
                  focus.password
                    ? "border-[#ffb92c] shadow-[0_0_0_2px_#ffb92c44]"
                    : "border-[#31394e]"
                }`}
              type="password"
              name="password"
              placeholder="Mật khẩu"
              autoComplete="current-password"
              value={form.password}
              onFocus={() => setFocus((f) => ({ ...f, password: true }))}
              onBlur={() => setFocus((f) => ({ ...f, password: false }))}
              onChange={onChange}
              required
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{
              scale: 1.035,
              backgroundColor: "#ffb92c",
              color: "#222",
            }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full bg-[#ffb92c] text-[#222] font-bold rounded-lg py-3 text-lg shadow transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <FiKey className="animate-spin" /> Đang đăng nhập...
              </span>
            ) : (
              "Đăng nhập"
            )}
          </motion.button>
        </form>
        <motion.div
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-sm text-[#4c5976] italic"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          © {new Date().getFullYear()} Quản trị hệ thống
        </motion.div>
      </motion.div>
    </div>
  );
}
