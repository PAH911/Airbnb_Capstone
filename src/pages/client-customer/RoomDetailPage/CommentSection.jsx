import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCommentsByRoom, postComment } from "./commentSlice";
import { motion } from "framer-motion";
import { UserOutlined, SendOutlined } from "@ant-design/icons";
import { Input, Button, message, Rate } from "antd";

const COMMENTS_PER_PAGE = 5;

export default function CommentSection({ roomId }) {
  const dispatch = useDispatch();
  const { list, loading, error, posting, postError } = useSelector(
    (state) => state.comment
  );
  const user = useSelector((state) => state.auth.user);
  const [content, setContent] = useState("");
  const [page, setPage] = useState(1);
  const [star, setStar] = useState(5);
  const [lastCommentId, setLastCommentId] = useState(null);

  useEffect(() => {
    if (roomId) dispatch(fetchCommentsByRoom(roomId));
    setPage(1); // Reset page khi đổi phòng
  }, [roomId, dispatch]);

  useEffect(() => {
    if (postError) message.error(postError);
  }, [postError]);

  const handleSubmit = () => {
    if (!user) return message.warning("Bạn cần đăng nhập để bình luận");
    if (!content.trim())
      return message.warning("Vui lòng nhập nội dung bình luận");
    dispatch(
      postComment({
        maPhong: roomId,
        maNguoiBinhLuan: user.id,
        ngayBinhLuan: new Date().toISOString(),
        noiDung: content.trim(),
        saoBinhLuan: star,
        tenNguoiBinhLuan: user.name,
        avatar: user.avatar,
      })
    ).then((res) => {
      if (res.payload && res.payload.id) {
        setLastCommentId(res.payload.id);
      }
    });
    setContent("");
    setStar(5);
    setPage(1); // Đưa về trang đầu tiên để thấy comment mới
  };

  // Sắp xếp comment: luôn ưu tiên comment vừa gửi lên đầu (dựa vào lastCommentId), còn lại sort theo thời gian mới nhất
  const sortedList = React.useMemo(() => {
    if (lastCommentId) {
      const mine = list.find((c) => c.id === lastCommentId);
      const rest = list.filter((c) => c.id !== lastCommentId);
      return mine
        ? [
            { ...mine, tenNguoiBinhLuan: user?.name, avatar: user?.avatar },
            ...rest.sort(
              (a, b) => new Date(b.ngayBinhLuan) - new Date(a.ngayBinhLuan)
            ),
          ]
        : [...list].sort(
            (a, b) => new Date(b.ngayBinhLuan) - new Date(a.ngayBinhLuan)
          );
    }
    return [...list].sort(
      (a, b) => new Date(b.ngayBinhLuan) - new Date(a.ngayBinhLuan)
    );
  }, [list, user, lastCommentId]);

  // Reset lastCommentId khi đổi phòng
  useEffect(() => {
    setLastCommentId(null);
  }, [roomId]);

  const totalPages = Math.ceil(sortedList.length / COMMENTS_PER_PAGE);
  const pagedComments = sortedList.slice(
    (page - 1) * COMMENTS_PER_PAGE,
    page * COMMENTS_PER_PAGE
  );

  return (
    <section className="mt-10">
      <motion.h2
        className="text-2xl font-bold mb-4 text-gray-900 dark:text-white"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Bình luận
      </motion.h2>
      <div className="mb-6">
        {user ? (
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex items-center gap-3">
              <Input.TextArea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                autoSize={{ minRows: 2, maxRows: 4 }}
                className="rounded-xl bg-white dark:bg-[#23232b] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                disabled={posting}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={posting}
                className="rounded-xl bg-rose-500 border-none hover:!bg-rose-600 ml-2"
                onClick={handleSubmit}
              >
                Gửi
              </Button>
            </div>
            <div className="flex items-center gap-2 ml-1">
              <span className="text-gray-700 dark:text-gray-200 text-sm">
                Đánh giá:
              </span>
              <Rate
                value={star}
                onChange={setStar}
                allowClear={false}
                className="text-rose-400 dark:text-rose-400"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-400">
              * Đăng nhập để bình luận
            </div>
          </>
        )}
      </div>
      {loading ? (
        <div>Đang tải bình luận...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="space-y-6">
          {pagedComments.length === 0 ? (
            <div className="text-gray-400 italic">Chưa có bình luận nào.</div>
          ) : (
            pagedComments.map((cmt, i) => (
              <motion.div
                key={cmt.id || i}
                className="flex gap-4 items-start bg-white dark:bg-[#18181c] rounded-2xl p-4 shadow border border-gray-100 dark:border-gray-800"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="flex-shrink-0">
                  {cmt.avatar ? (
                    <img
                      src={cmt.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <UserOutlined className="w-10 h-10 text-rose-400 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center p-2 text-2xl" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {cmt.tenNguoiBinhLuan || "Ẩn danh"}
                  </div>
                  <div className="text-gray-500 dark:text-gray-300 text-sm mb-1">
                    {new Date(cmt.ngayBinhLuan).toLocaleString()}
                  </div>
                  <div className="text-base text-gray-800 dark:text-gray-100 mb-1">
                    {cmt.noiDung}
                  </div>
                  <div className="text-yellow-500 font-bold">
                    ★ {cmt.saoBinhLuan || 5}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
      {/* Pagination tabs */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            className={`px-2 py-1 rounded-full font-semibold text-base border shadow flex items-center justify-center
              bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700
              hover:bg-rose-100 dark:hover:bg-gray-600 transition-all
              ${
                page === 1 ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
              }`}
            onClick={() => page > 1 && setPage(page - 1)}
            disabled={page === 1}
            aria-label="Trang trước"
          >
            <span className="text-lg">&#8592;</span>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((i) => {
              if (totalPages <= 5) return true;
              if (page <= 3) return i <= 5;
              if (page >= totalPages - 2) return i > totalPages - 5;
              return Math.abs(i - page) <= 2;
            })
            .map((i) => (
              <button
                key={i}
                className={`px-3 py-1.5 rounded-full font-semibold text-base border shadow transition-all
                  ${
                    page === i
                      ? "bg-rose-500 text-white border-rose-400 scale-110 shadow-lg"
                      : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 hover:bg-rose-100 dark:hover:bg-gray-600 hover:scale-105"
                  }`}
                onClick={() => setPage(i)}
              >
                {i}
              </button>
            ))}
          <button
            className={`px-2 py-1 rounded-full font-semibold text-base border shadow flex items-center justify-center
              bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700
              hover:bg-rose-100 dark:hover:bg-gray-600 transition-all
              ${
                page === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-110"
              }`}
            onClick={() => page < totalPages && setPage(page + 1)}
            disabled={page === totalPages}
            aria-label="Trang sau"
          >
            <span className="text-lg">&#8594;</span>
          </button>
        </div>
      )}
    </section>
  );
}
