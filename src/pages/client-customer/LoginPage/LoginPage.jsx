import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  message,
  Spin,
  notification,
} from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { login, register } from "../../../services/authService";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../../contexts/ThemeContext";
import { useDispatch } from "react-redux";
import { login as loginThunk } from "./authSlice";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./login-dark-theme.css";

const { Title } = Typography;

// Validation schemas
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email(
      "Email không hợp lệ! Vui lòng nhập đúng định dạng email (vd: user@example.com)"
    )
    .required("Email là bắt buộc!"),
  password: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự!")
    .required("Mật khẩu là bắt buộc!"),
});
const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Họ tên phải có ít nhất 2 ký tự!")
    .max(50, "Họ tên không được quá 50 ký tự!")
    .required("Họ tên là bắt buộc!"),
  email: Yup.string()
    .email(
      "Email không hợp lệ! Vui lòng nhập đúng định dạng email (vd: user@example.com)"
    )
    .required("Email là bắt buộc!"),
  password: Yup.string()
    .required("Mật khẩu là bắt buộc!")
    .min(8, "Mật khẩu tối thiểu 8 ký tự!")
    .matches(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa!")
    .matches(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường!")
    .matches(/[0-9]/, "Mật khẩu phải có ít nhất 1 số!")
    .matches(/[@$!%*?&]/, "Mật khẩu phải có ký tự đặc biệt (@$!%*?&)!"),
  confirm: Yup.string()
    .oneOf([Yup.ref("password"), null], "Nhập lại mật khẩu không khớp!")
    .required("Nhập lại mật khẩu là bắt buộc!"),
  phone: Yup.string()
    .required("Số điện thoại là bắt buộc!")
    .matches(
      /^(0[0-9]{9,10})$/,
      "Số điện thoại phải bắt đầu bằng 0 và có 10-11 chữ số!"
    ),
  birthday: Yup.string()
    .required("Ngày sinh là bắt buộc!")
    .test(
      "is-past",
      "Ngày sinh không thể là ngày trong tương lai!",
      function (value) {
        if (!value) return true;
        const birthday = new Date(value);
        const today = new Date();
        return birthday <= today;
      }
    ),
  gender: Yup.boolean().required("Giới tính là bắt buộc!"),
});

export default function LoginPage() {
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();
  const dispatch = useDispatch();

  const onLogin = async (values) => {
    setLoading(true);
    try {
      // Đăng nhập qua redux-thunk để cập nhật user vào redux store
      const result = await dispatch(loginThunk(values));
      if (result.meta.requestStatus === "fulfilled") {
        notification.success({
          message: "Đăng nhập thành công!",
          description: "Chào mừng bạn quay trở lại TripNest!",
          placement: "topRight",
          duration: 2,
          style: {
            borderRadius: 12,
            boxShadow: "0 4px 32px rgba(34, 197, 94, 0.2)",
            border: "1px solid #bbf7d0",
          },
        });

        // Kiểm tra location.state.from để redirect về booking nếu có
        if (location.state && location.state.from) {
          navigate(location.state.from.pathname, {
            state: location.state.from.state || undefined,
            replace: true,
          });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        // Xử lý lỗi đăng nhập với thông báo từ API
        const errorMsg = result.payload || "Đăng nhập thất bại!";

        notification.error({
          message: "Đăng nhập thất bại",
          description: errorMsg,
          placement: "topRight",
          duration: 4,
          className: "login-error-notification",
          style: {
            borderRadius: 12,
            boxShadow: "0 4px 32px rgba(239, 68, 68, 0.2)",
            border: "1px solid #fecaca",
          },
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      notification.error({
        message: "Đăng nhập thất bại",
        description:
          "Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại!",
        placement: "topRight",
        duration: 4,
        className: "login-error-notification",
        style: {
          borderRadius: 12,
          boxShadow: "0 4px 32px rgba(239, 68, 68, 0.2)",
          border: "1px solid #fecaca",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (values) => {
    setLoading(true);
    try {
      await register(values);
      notification.success({
        message: "Đăng ký thành công!",
        description:
          "Tài khoản của bạn đã được tạo. Hãy đăng nhập để tiếp tục.",
        placement: "topRight",
        duration: 3,
        style: {
          borderRadius: 12,
          boxShadow: "0 4px 32px rgba(34, 197, 94, 0.2)",
          border: "1px solid #bbf7d0",
        },
      });
      setTab("login");
    } catch (err) {
      console.error("Register error:", err);

      // Lấy thông báo lỗi từ API response
      const errorMsg =
        err?.response?.data?.content ||
        err?.response?.data?.message ||
        err?.message ||
        "Đăng ký thất bại!";

      notification.error({
        message: "Đăng ký thất bại",
        description: errorMsg,
        placement: "topRight",
        duration: 4,
        className: "login-error-notification",
        style: {
          borderRadius: 12,
          boxShadow: "0 4px 32px rgba(239, 68, 68, 0.2)",
          border: "1px solid #fecaca",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, x: 60, scale: 0.98 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { type: "spring", duration: 0.5 },
    },
    exit: {
      opacity: 0,
      x: -60,
      scale: 0.98,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="login-page relative min-h-screen flex flex-col justify-between bg-gradient-to-br from-rose-200 via-pink-100 to-rose-400 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors overflow-hidden">
      <Header />
      {/* Hiệu ứng nền động đẹp mắt */}
      <div className="pointer-events-none select-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-rose-400/20 rounded-full blur-3xl animate-pulse z-0" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse z-0" />
        <div
          className="absolute top-1/2 left-1/2 w-60 h-60 bg-rose-300/10 rounded-full blur-2xl animate-pulse z-0"
          style={{ transform: "translate(-50%,-50%)" }}
        />
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-pink-200/20 rounded-full blur-2xl animate-pulse z-0" />
      </div>
      <div className="flex-1 flex items-center justify-center z-10">
        <motion.div
          className="w-full max-w-2xl bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl p-10 backdrop-blur-lg relative overflow-hidden animate-fade-in mx-auto my-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          style={{ boxShadow: "0 8px 40px 0 rgba(244,63,94,0.15)" }}
        >
          <Title
            level={2}
            className="text-center mb-6 text-rose-500 dark:text-white font-extrabold drop-shadow-lg z-10"
          >
            Chào mừng đến TripNest
          </Title>
          <div className="flex justify-center mb-8 z-10 relative">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 shadow-inner">
              <button
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 focus:outline-none ${
                  tab === "login"
                    ? "bg-rose-500 text-white shadow-lg scale-105"
                    : "text-gray-700 dark:text-gray-200 hover:bg-rose-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => setTab("login")}
                type="button"
              >
                Đăng nhập
              </button>
              <button
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 focus:outline-none ${
                  tab === "register"
                    ? "bg-rose-500 text-white shadow-lg scale-105"
                    : "text-gray-700 dark:text-gray-200 hover:bg-rose-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => setTab("register")}
                type="button"
              >
                Đăng ký
              </button>
            </div>
          </div>
          <Spin spinning={loading} className="z-10">
            <AnimatePresence mode="wait" initial={false}>
              {tab === "login" ? (
                <motion.div
                  key="login"
                  variants={{
                    hidden: { opacity: 0, x: 80, scale: 0.98 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      scale: 1,
                      transition: { type: "spring", duration: 0.6 },
                    },
                    exit: {
                      opacity: 0,
                      x: -80,
                      scale: 0.98,
                      transition: { duration: 0.4 },
                    },
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="z-10"
                >
                  <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={loginSchema}
                    onSubmit={onLogin}
                  >
                    {({ handleSubmit }) => (
                      <FormikForm onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="font-semibold dark:text-gray-200">
                            Email
                          </label>
                          <Field
                            name="email"
                            as={Input}
                            prefix={<MailOutlined />}
                            size="large"
                            className="rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-300 transition-all duration-300 bg-white text-gray-900 placeholder-gray-400 border-gray-300 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:bg-gray-900 dark:focus:ring-rose-400"
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>
                        <div>
                          <label className="font-semibold dark:text-gray-200">
                            Mật khẩu
                          </label>
                          <Field
                            name="password"
                            as={Input.Password}
                            prefix={<LockOutlined />}
                            size="large"
                            className="rounded-full shadow focus:shadow-lg transition-all duration-300 bg-white text-gray-900 placeholder-gray-400 border-gray-300 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:bg-gray-900 dark:focus:ring-rose-400"
                          />
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>
                        <Button
                          type="primary"
                          htmlType="submit"
                          size="large"
                          className="w-full bg-rose-500 hover:bg-rose-600 border-none rounded-full font-semibold mt-2 shadow-lg transition-all duration-300"
                        >
                          Đăng nhập
                        </Button>
                      </FormikForm>
                    )}
                  </Formik>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  variants={{
                    hidden: { opacity: 0, x: -80, scale: 0.98 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      scale: 1,
                      transition: { type: "spring", duration: 0.6 },
                    },
                    exit: {
                      opacity: 0,
                      x: 80,
                      scale: 0.98,
                      transition: { duration: 0.4 },
                    },
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="z-10"
                >
                  <Formik
                    initialValues={{
                      name: "",
                      email: "",
                      password: "",
                      confirm: "",
                      phone: "",
                      birthday: "",
                      gender: true,
                    }}
                    validationSchema={registerSchema}
                    onSubmit={onRegister}
                  >
                    {({ handleSubmit, setFieldValue, values }) => (
                      <FormikForm onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                          <div>
                            <label className="font-semibold dark:text-gray-200">
                              Họ tên
                            </label>
                            <Field
                              name="name"
                              as={Input}
                              prefix={<UserOutlined />}
                              size="large"
                              className="rounded-full shadow focus:shadow-lg transition-all duration-300 bg-white text-gray-900 placeholder-gray-400 border-gray-300 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:bg-gray-900 dark:focus:ring-rose-400"
                            />
                            <ErrorMessage
                              name="name"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                            <label className="font-semibold mt-2 dark:text-gray-200">
                              Email
                            </label>
                            <Field
                              name="email"
                              as={Input}
                              prefix={<MailOutlined />}
                              size="large"
                              className="rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-300 transition-all duration-300 bg-white text-gray-900 placeholder-gray-400 border-gray-300 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:bg-gray-900 dark:focus:ring-rose-400"
                            />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                            <label className="font-semibold mt-2 dark:text-gray-200">
                              Mật khẩu
                            </label>
                            <Field
                              name="password"
                              as={Input.Password}
                              prefix={<LockOutlined />}
                              size="large"
                              className="rounded-full shadow focus:shadow-lg transition-all duration-300 bg-white text-gray-900 placeholder-gray-400 border-gray-300 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:bg-gray-900 dark:focus:ring-rose-400"
                            />
                            <ErrorMessage
                              name="password"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                            <label className="font-semibold mt-2 dark:text-gray-200">
                              Nhập lại mật khẩu
                            </label>
                            <Field
                              name="confirm"
                              as={Input.Password}
                              prefix={<LockOutlined />}
                              size="large"
                              className="rounded-full shadow focus:shadow-lg transition-all duration-300 bg-white text-gray-900 placeholder-gray-400 border-gray-300 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:bg-gray-900 dark:focus:ring-rose-400"
                            />
                            <ErrorMessage
                              name="confirm"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>
                          <div>
                            <label className="font-semibold dark:text-gray-200">
                              Số điện thoại
                            </label>
                            <Field
                              name="phone"
                              as={Input}
                              size="large"
                              className="rounded-full shadow focus:shadow-lg transition-all duration-300 bg-white text-gray-900 placeholder-gray-400 border-gray-300 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:bg-gray-900 dark:focus:ring-rose-400"
                            />
                            <ErrorMessage
                              name="phone"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                            <label className="font-semibold mt-2 dark:text-gray-200">
                              Ngày sinh
                            </label>
                            <Field
                              name="birthday"
                              as={Input}
                              type="date"
                              size="large"
                              className="rounded-full shadow focus:shadow-lg transition-all duration-300 bg-white text-gray-900 placeholder-gray-400 border-gray-300 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:bg-gray-900 dark:focus:ring-rose-400"
                            />
                            <ErrorMessage
                              name="birthday"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                            <label className="font-semibold mt-2 dark:text-gray-200">
                              Giới tính
                            </label>
                            <Field
                              name="gender"
                              as="select"
                              className="w-full rounded-full shadow focus:shadow-lg transition-all duration-300 px-4 py-2 bg-white text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:bg-gray-900 dark:focus:ring-rose-400"
                            >
                              <option value={true}>Nam</option>
                              <option value={false}>Nữ</option>
                            </Field>
                            <ErrorMessage
                              name="gender"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>
                        </div>
                        <Button
                          type="primary"
                          htmlType="submit"
                          size="large"
                          className="w-full bg-rose-500 hover:bg-rose-600 border-none rounded-full font-semibold mt-2 shadow-lg transition-all duration-300"
                        >
                          Đăng ký
                        </Button>
                      </FormikForm>
                    )}
                  </Formik>
                </motion.div>
              )}
            </AnimatePresence>
          </Spin>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
