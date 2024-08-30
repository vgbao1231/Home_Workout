export const formatter = {
    capitalizeWords: (event) => {
        return {
            event: event,
            check: (str) =>
                str
                    .toLowerCase()
                    .split(' ')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' '),
        };
    },
    trimWords: (event) => {
        return {
            event: event,
            check: (str) => str.trim(),
        };
    },
    formatCurrency: (event) => {
        return {
            event: event,
            check: (value) => new Intl.NumberFormat('vi-VN').format(value),
        };
    },

    // More...
};
