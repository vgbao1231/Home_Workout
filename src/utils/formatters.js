export const formatters = {
    capitalizeWords: (str) =>
        str
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
    trimWords: (event) => {
        return {
            event: event,
            formatter: (str) => str.trim(),
        };
    },
    formatCurrency: (event) => {
        return {
            event: event,
            formatter: (value) => new Intl.NumberFormat('vi-VN').format(value),
        };
    },

    // More...
};
