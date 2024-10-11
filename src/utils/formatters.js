export const capitalizeWords = (str) =>
    str
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

export const trimWords = (str) => str.trim();

export const formatCurrency = (value) => new Intl.NumberFormat('vi-VN').format(value);

// Xuất thêm các hàm khác nếu cần
