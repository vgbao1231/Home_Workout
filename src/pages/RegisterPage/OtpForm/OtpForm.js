import { ArrowLeft } from 'lucide-react';
import './OtpForm.scss';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '~/redux/slices/toastSlice';

function OtpForm({ otp, next, back }) {
    const otpRefs = useRef([]);

    const dispatch = useDispatch();

    const handleKeyDown = (e, index) => {
        // setTimeout is to delay focusing on the next otp before the value is entered
        if (e.key >= '0' && e.key <= '9') {
            otpRefs.current[index].value = ''; //Rest current value and replace with the new one
            otpRefs.current[index + 1] && setTimeout(() => otpRefs.current[index + 1].focus(), 0);
        } else if (e.key === 'Backspace' && !otpRefs.current[index].value) {
            otpRefs.current[index - 1] && setTimeout(() => otpRefs.current[index - 1].focus(), 0);
        } else if (e.key === 'ArrowLeft') {
            otpRefs.current[index - 1] && setTimeout(() => otpRefs.current[index - 1].focus(), 0);
        } else if (e.key === 'ArrowRight') {
            otpRefs.current[index + 1] && setTimeout(() => otpRefs.current[index + 1].focus(), 0);
        }
    };

    console.log(otp);

    const handleClick = (e) => {
        const otpValues = otpRefs.current.map((ref) => ref.value).join('');
        if (otpValues === otp) {
            console.log('OTP is correct!');
            dispatch(addToast('OTP is correct', 'success'));
        } else {
            dispatch(addToast('OTP is incorrect', 'error'));
            e.preventDefault();
        }
    };

    return (
        <>
            <div className={'title'}>OTP</div>
            <div className="otp-fields center">
                {Array(4)
                    .fill(0)
                    .map((_, index) => (
                        <input
                            key={index}
                            ref={(e) => (otpRefs.current[index] = e)} // Save ref for each input
                            type="number"
                            className="otp-field"
                            placeholder="0"
                            min="0"
                            max="9"
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                    ))}
            </div>
            <div className="form-button">
                <button className="center" type="button" onClick={back}>
                    <ArrowLeft />
                    <span>Back</span>
                </button>
                <button className="center" type="submit" onClick={handleClick}>
                    Confirm
                </button>
            </div>
        </>
    );
}

export default OtpForm;
