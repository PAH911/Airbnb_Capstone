// Utility function để tính toán rating trung bình từ comments
export const calculateAverageRating = (comments) => {
  if (!comments || comments.length === 0) {
    return { averageRating: null, totalComments: 0 };
  }

  const totalRating = comments.reduce((sum, comment) => {
    return sum + (comment.saoBinhLuan || 5);
  }, 0);

  const averageRating = totalRating / comments.length;

  return {
    averageRating: Number(averageRating.toFixed(1)),
    totalComments: comments.length,
  };
};

// Helper function để format hiển thị rating
export const formatRatingDisplay = (room) => {
  // Nếu không có comment thì không hiển thị sao
  if (!room.totalComments || room.totalComments === 0) {
    return {
      rating: null,
      totalComments: 0,
      hasComments: false,
      displayText: "Chưa có đánh giá",
    };
  }

  const rating = room.averageRating;
  const totalComments = room.totalComments || 0;

  return {
    rating: typeof rating === "number" ? rating.toFixed(1) : null,
    totalComments,
    hasComments: totalComments > 0,
    displayText: `${rating.toFixed(1)} sao (${totalComments} đánh giá)`,
  };
};
