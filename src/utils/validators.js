export const validators = {
    isRequired: (event, message) => {
        return {
            event: event,
            check: (value) => (value ? undefined : message || 'Vui lòng không bỏ trống'),
        };
    },
    isAlphabetic: (event, message) => {
        return {
            event: event,
            check: (value) => (!/\d/.test(value) ? undefined : message || 'Vui lòng không nhập số'),
        };
    },
    isEmail: (event, message) => {
        return {
            event: event,
            check: (value) => {
                var regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
                return regex.test(value) ? undefined : message || 'Email không hợp lệ';
            },
        };
    },
    minLength: (event, minLength, message) => {
        return {
            event: event,
            check: (value) =>
                value.trim().length >= minLength ? undefined : message || `Giá trị phải có ít nhất ${minLength} ký tự.`,
        };
    },
    minValue: (event, minValue, message) => {
        return {
            event: event,
            check: (value) =>
                Number(value) >= minValue ? undefined : message || `Giá trị phải lớn hơn hoặc bằng ${minValue}.`,
        };
    },
    isAdult: (event, minAge, message) => {
        return {
            event: event,
            check: (value) => {
                const today = new Date();
                const birthDate = new Date(value);
                const age = today.getFullYear() - birthDate.getFullYear();
                const isOldEnough =
                    today.getMonth() > birthDate.getMonth() ||
                    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
                return age > minAge || (age === minAge && isOldEnough)
                    ? undefined
                    : message || `Ngày sinh không hợp lệ (Chưa đủ ${minAge} tuổi)`;
            },
        };
    },
    // More...
};
