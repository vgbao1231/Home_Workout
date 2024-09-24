export const validators = {
    isRequired: (value) => (value ? '' : 'Vui lòng không bỏ trống'),

    isAlphabetic: (value) => (!/\d/.test(value) ? '' : 'Vui lòng chỉ nhập chữ cái'),

    isEmail: (value) => {
        var regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        return regex.test(value) ? '' : 'Email không hợp lệ';
    },

    minLength: (minLength) => (value) =>
        value.trim().length >= minLength ? '' : `Giá trị phải có ít nhất ${minLength} ký tự.`,

    minValue: (minValue) => (value) => Number(value) >= minValue ? '' : `Giá trị phải lớn hơn hoặc bằng ${minValue}.`,

    isAdult: (minAge) => (value) => {
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        const isOldEnough =
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
        return age > minAge || (age === minAge && isOldEnough) ? '' : `Ngày sinh không hợp lệ (Chưa đủ ${minAge} tuổi)`;
    },

    // More validators...
};
