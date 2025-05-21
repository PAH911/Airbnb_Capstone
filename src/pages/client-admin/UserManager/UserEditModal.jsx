import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { updateUser } from "./adminUserSlice";

export default function UserEditModal({ open, onClose, onSuccess, onFailed, user }) {
  const dispatch = useDispatch();
  const { updateLoading } = useSelector((state) => state.userList);

  const [form, setForm] = useState({
    id: 0,
    name: "",
    email: "",
    password: "",
    birthday: "",
    gender: true,
    role: "USER",
  });

  useEffect(() => {
    if (user) {
      setForm({
        id: user.id,
        name: user.name || "",
        email: user.email || "",
        password: "",
        birthday: user.birthday ? user.birthday.split("T")[0] : "",
        gender: user.gender,
        role: user.role || "USER",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "radio" ? value === "true" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      gender: form.gender === true || form.gender === "true",
      phone: null,
    };
    const result = await dispatch(updateUser(payload));
    if (updateUser.fulfilled.match(result)) {
      onSuccess();
    } else if (updateUser.rejected.match(result)) {
      onFailed(result.payload || "Lỗi không xác định");
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[#151820cc] backdrop-blur-[4px]" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center px-4 py-8">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              className="
                w-full max-w-md
                sm:max-w-lg
                rounded-3xl
                bg-[#202531]/95
                border border-customYellow/30
                shadow-[0_8px_32px_0_rgba(18,19,27,0.45),0_1.5px_8px_0_rgba(44,235,255,0.06)]
                px-6 py-6
                sm:px-8 sm:py-8
                ring-1 ring-customYellow/10
                transition-all
              "
              style={{
                width: "100%",
                maxWidth: 440,
                maxHeight: "80vh",
              }}
            >
              <PerfectScrollbar
                options={{ suppressScrollX: true }}
                style={{ maxHeight: "70vh", paddingRight: 12 }}
              >
                <Dialog.Title className="text-3xl text-center font-bold text-customYellow mb-8 drop-shadow-cyan">
                  Cập nhật thông tin người dùng
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-2 font-semibold text-[#EAF7FF]">Tên</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      required
                      autoFocus
                      onChange={handleChange}
                      placeholder="Nhập tên..."
                      className="w-full p-2.5 rounded-xl bg-[#23283A] border border-customYellow/30 text-white placeholder:text-customYellow/60 outline-none focus:border-customYellow focus:shadow-[0_0_0_2px_rgba(255,185,44,0.25)] transition"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-[#EAF7FF]">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      required
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className="w-full p-2.5 rounded-xl bg-[#23283A] border border-customYellow/30 text-white placeholder:text-customYellow/60 outline-none focus:border-customYellow transition"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-[#EAF7FF]">
                      Mật khẩu (để trống nếu không đổi)
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Nhập mật khẩu mới..."
                      className="w-full p-2.5 rounded-xl bg-[#23283A] border border-customYellow/30 text-white placeholder:text-customYellow/60 outline-none focus:border-customYellow transition"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-[#EAF7FF]">Ngày sinh</label>
                    <input
                      type="date"
                      name="birthday"
                      value={form.birthday}
                      required
                      onChange={handleChange}
                      className="w-full p-2.5 rounded-xl bg-[#23283A] border border-customYellow/30 text-white outline-none focus:border-customYellow transition"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-[#EAF7FF]">Giới tính</label>
                    <div className="flex gap-8 pt-1">
                      <label className="flex items-center gap-2 text-white font-medium">
                        <input
                          type="radio"
                          name="gender"
                          value={true}
                          checked={form.gender === true || form.gender === "true"}
                          onChange={handleChange}
                          className="accent-customYellow"
                        />
                        Nam
                      </label>
                      <label className="flex items-center gap-2 text-white font-medium">
                        <input
                          type="radio"
                          name="gender"
                          value={false}
                          checked={form.gender === false || form.gender === "false"}
                          onChange={handleChange}
                          className="accent-customYellow"
                        />
                        Nữ
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-[#EAF7FF]">Quyền</label>
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="w-full p-2.5 rounded-xl bg-[#23283A] border border-customYellow/30 text-white outline-none focus:border-customYellow transition"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="USER">USER</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-4 mt-8">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2 rounded-xl font-semibold bg-gray-500/70 text-white hover:bg-gray-700/90 transition"
                    >
                      Huỷ
                    </button>
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="px-6 py-2 rounded-xl font-bold bg-customYellow hover:bg-yellow-400 text-[#222] transition drop-shadow-lg"
                    >
                      {updateLoading ? "Đang lưu..." : "Lưu"}
                    </button>
                  </div>
                </form>
              </PerfectScrollbar>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
