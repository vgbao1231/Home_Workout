import { ArrowLeft } from 'lucide-react';
import './OtpForm.scss';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '~/redux/slices/toastSlice';
import { UserInfoUserService } from '~/services/userInfoService';

function OtpForm({ formData, otpExpiredTime = 0 }) {
    const otpRefs = useRef([]);

    const dispatch = useDispatch();
    const [counter, setCounter] = useState(otpExpiredTime)

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otpRefs.current[index].value) {
            otpRefs.current[index - 1] && setTimeout(() => otpRefs.current[index - 1].focus(), 0);
        } else if (e.key === 'ArrowLeft') {
            otpRefs.current[index - 1] && setTimeout(() => otpRefs.current[index - 1].focus(), 0);
        } else if (e.key === 'ArrowRight') {
            otpRefs.current[index + 1] && setTimeout(() => otpRefs.current[index + 1].focus(), 0);
        }
    };

    const handleInput = (e, index) => {
        const char = e.target.value;
        if ((char >= '0' && char <= '9') || (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
            e.target.value = char.toUpperCase();
            otpRefs.current[index + 1] && otpRefs.current[index + 1].focus();
        } else {
            e.target.value = '';
        }
    };

    const handleButtonClick = async (e) => {
        const otpValues = otpRefs.current.map((ref) => ref.value).join('');
        try {
            const responseVerify = await UserInfoUserService.verifyChangePasswordOtp({ otpCode: otpValues })

            if (responseVerify.httpStatusCode) {
                const responseChangePass = await UserInfoUserService.changePassword({ password: formData.newPassword, otpCode: responseVerify.data.otpCode })
                if (responseChangePass.httpStatusCode) {
                    dispatch(addToast(responseChangePass.message, 'success'));
                }
            } else {
                e.preventDefault();
                dispatch(addToast('OTP is incorrect', 'error'));
            }
        } catch (error) {
            e.preventDefault();
            dispatch(addToast(error.message, 'error'));
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }


    useEffect(() => {
        const timer = setInterval(() => {
            setCounter(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className='otp-form'>
            <div className="otp-fields center">
                {Array(4)
                    .fill(0)
                    .map((_, index) => (
                        <input
                            key={index}
                            ref={(e) => (otpRefs.current[index] = e)} // Save ref for each input
                            className="otp-field"
                            maxLength={1}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onInput={(e) => handleInput(e, index)}
                        />
                    ))}
            </div>
            <div className="otp-timer center">{formatTime(counter)}</div>
            <button onClick={handleButtonClick} className="btn">Confirm</button>
        </div>
    );
}

export default OtpForm;
