import { ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '~/redux/slices/toastSlice';
import { AuthPublicService } from '~/services/authService';
import './OtpForm.scss'

function OtpForm({ email, otpExpiredTime = 0, back }) {
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

    const handleClick = async (e) => {
        const otpValues = otpRefs.current.map((ref) => ref.value).join('');
        const response = await AuthPublicService.generateRandomPassword({ email, otpCode: otpValues })
        if (response.httpStatusCode) {
            dispatch(addToast('OTP is correct', 'success'));
        } else {
            dispatch(addToast('OTP is incorrect', 'error'));
            e.preventDefault();
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
            <div className={'title'}>OTP</div>
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
            <div className="form-button">
                <button className="center" type="button" onClick={back}>
                    <ArrowLeft />
                    <span>Back</span>
                </button>
                <button className="center" type="submit" onClick={handleClick}>
                    Confirm
                </button>
            </div>
        </div>
    );
}

export default OtpForm;
