export const formatters = {
    capitalizeWords: (str) =>
        str
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),

    trimWords: (str) => str.trim(),
    formatCurrency: (value) => new Intl.NumberFormat('vi-VN').format(value),

    // More...
};
