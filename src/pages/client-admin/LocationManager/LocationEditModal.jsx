import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { updateLocation } from "./locationSlice";

export default function LocationEditModal({
  open,
  onClose,
  onSuccess,
  onFailed,
  location,
}) {
  const dispatch = useDispatch();
  const { updateLoading } = useSelector((state) => state.location);

  const [form, setForm] = useState({
    tenViTri: "",
    tinhThanh: "",
    quocGia: "",
  });
  const [imageFile, setImageFile] = useState(null);

  // Load data khi modal mở và có location
  useEffect(() => {
    if (location && open) {
      setForm({
        tenViTri: location.tenViTri || "",
        tinhThanh: location.tinhThanh || "",
        quocGia: location.quocGia || "",
      });
    }
  }, [location, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        updateLocation({
          id: location.id,
          location: form,
          imageFile,
        })
      );
      if (updateLocation.fulfilled.match(result)) {
        onSuccess();
        setImageFile(null);
      } else {
        onFailed(result.payload || "Lỗi cập nhật vị trí");
      }
    } catch (error) {
      onFailed(error.message);
    }
  };

  const handleClose = () => {
    setForm({ tenViTri: "", tinhThanh: "", quocGia: "" });
    setImageFile(null);
    onClose();
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
                rounded-3xl
                bg-[#202531]/95
                border border-yellow-500/30
                shadow-lg
                px-6 py-6
                ring-1 ring-yellow-500/10
                transition-all
              "
              style={{ maxHeight: "80vh" }}
            >
              <PerfectScrollbar
                options={{ suppressScrollX: true }}
                style={{ maxHeight: "70vh", paddingRight: 12 }}
              >
                <Dialog.Title className="text-3xl text-center font-bold text-yellow-400 mb-8">
                  Cập nhật vị trí
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-2 font-semibold text-[#EAF7FF]">
                      Tên vị trí
                    </label>
                    <input
                      type="text"
                      name="tenViTri"
                      value={form.tenViTri}
                      required
                      onChange={handleChange}
                      placeholder="Nhập tên vị trí..."
                      className="w-full p-2.5 rounded-xl bg-[#23283A] border border-yellow-900/30 text-white placeholder-yellow-400 outline-none focus:border-yellow-400 focus:shadow-yellow-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-[#EAF7FF]">
                      Tỉnh thành
                    </label>
                    <input
                      type="text"
                      name="tinhThanh"
                      value={form.tinhThanh}
                      required
                      onChange={handleChange}
                      placeholder="Nhập tỉnh thành..."
                      className="w-full p-2.5 rounded-xl bg-[#23283A] border border-yellow-900/30 text-white placeholder-yellow-400 outline-none focus:border-yellow-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-[#EAF7FF]">
                      Quốc gia
                    </label>
                    <input
                      type="text"
                      name="quocGia"
                      value={form.quocGia}
                      required
                      onChange={handleChange}
                      placeholder="Nhập quốc gia..."
                      className="w-full p-2.5 rounded-xl bg-[#23283A] border border-yellow-900/30 text-white placeholder-yellow-400 outline-none focus:border-yellow-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-[#EAF7FF]">
                      Hình ảnh hiện tại
                    </label>
                    {location?.hinhAnh ? (
                      <img
                        src={location.hinhAnh}
                        alt="Ảnh vị trí hiện tại"
                        className="w-32 h-20 rounded-lg object-cover mb-2"
                      />
                    ) : (
                      <div className="w-32 h-20 rounded-lg bg-gray-600 flex items-center justify-center text-yellow-400 font-bold mb-2">
                        NULL
                      </div>
                    )}
                    <label className="block mb-2 font-semibold text-[#EAF7FF]">
                      Thay đổi hình ảnh
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full text-white"
                    />
                    {imageFile && (
                      <p className="mt-2 text-yellow-400">
                        Đã chọn file: {imageFile.name}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end gap-4 mt-8">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-5 py-2 rounded-xl font-semibold bg-gray-600 text-white hover:bg-gray-700 transition"
                    >
                      Huỷ
                    </button>
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="px-6 py-2 rounded-xl font-bold bg-yellow-400 hover:bg-yellow-300 text-[#222] transition"
                    >
                      {updateLoading ? "Đang cập nhật..." : "Cập nhật"}
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
