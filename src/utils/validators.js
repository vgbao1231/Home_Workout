export const isRequired = (value) =>
    (Array.isArray(value) ? value.length : value) ? undefined : 'Vui lòng không bỏ trống';

export const isAlphabetic = (value) => (!/\d/.test(value) ? undefined : 'Vui lòng chỉ nhập chữ cái');

export const isEmail = (value) => {
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(value) ? undefined : 'Email không hợp lệ';
};

export const minLength = (minLength) => (value) =>
    value.trim().length >= minLength ? undefined : `Giá trị phải có ít nhất ${minLength} ký tự.`;

export const minValue = (minValue) => (value) =>
    Number(value) >= minValue ? undefined : `Giá trị phải lớn hơn hoặc bằng ${minValue}.`;

export const isAdult = (minAge) => (value) => {
    const today = new Date();
    const birthDate = new Date(value);
    const age = today.getFullYear() - birthDate.getFullYear();
    const isOldEnough =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
    return age > minAge || (age === minAge && isOldEnough)
        ? undefined
        : `Ngày sinh không hợp lệ (Chưa đủ ${minAge} tuổi)`;
};

// More validators...
