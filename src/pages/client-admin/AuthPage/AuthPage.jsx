import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin } from "./authSlice"; // đổi path đúng nếu khác
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
  };
  const { user, loading } = adminlogin;

  const [form, setForm] = useState({ email: "", password: "" });
  const [focus, setFocus] = useState({ email: false, password: false });

  // Theo dõi user thay đổi để chuyển trang khi đúng quyền
  useEffect(() => {
    // Nếu user đúng quyền admin → chuyển trang
    if (user && user.role && user.role.toLowerCase() === "admin") {
      toast.success("Đăng nhập thành công!");
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    const res = await dispatch(loginAdmin(form));
    console.log("=== login result ===", res);

    // Lấy user đúng chuẩn từ payload
    const userRes = res.payload?.content?.user || res.payload?.user;
    // Nếu sai tài khoản/mật khẩu (userRes undefined)
    if (res.meta.requestStatus !== "fulfilled" || !userRes) {
      toast.error("Sai tài khoản hoặc mật khẩu!");
      return;
    }
    // Nếu đúng tài khoản nhưng sai quyền
    if (userRes.role?.toLowerCase() !== "admin") {
      toast.error("Bạn không đủ quyền truy cập admin!");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return;
    }
    // Nếu đúng quyền thì không cần navigate ở đây nữa (đã có useEffect handle)
    // toast.success("Đăng nhập thành công!"); // toast sẽ hiện ở useEffect
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
