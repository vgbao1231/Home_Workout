import { Form } from '~/components';
import './ForgotPasswordPage.scss';
import { useMultistepForm } from '~/hooks/useMultiStepForm';
import OtpForm from './OtpForm/OtpForm';
import { cloneElement, useState } from 'react';
import ForgotPasswordForm from './ForgotPasswordForm/ForgotPasswordForm';
import { AuthPublicService } from '~/services/authService';
import { useNavigate } from 'react-router-dom';

function ForgotPasswordPage() {
    const { currentStepIndex, step, isLastStep, next } = useMultistepForm([
        <ForgotPasswordForm />,
        <OtpForm />,
    ]);
    const [formData, setFormData] = useState()
    const [otpExpiredTime, setOtpExpiredTime] = useState()
    const navigate = useNavigate()

    // Handle logic
    const handleForgotPassword = async (data) => {
        console.log(data);

        setFormData(data)
        // Before going to the otp form, send the api to get the otp code
        if (currentStepIndex === 0) {
            const response = await AuthPublicService.getForgotPasswordOtp(data.email)
            setOtpExpiredTime(response.data.ageInSeconds);
            return next();
        }
        if (!isLastStep) return next();
        else {
            const { confirmPassword, ...formData } = data
            console.log(formData);
            navigate('/login')
        };
    };

    return (
        <div className="forgotPassword-container center">
            <div className="forgotPassword-background"></div>
            <div className="forgotPassword-form">
                <Form onSubmit={handleForgotPassword}>
                    {currentStepIndex === 1 ? cloneElement(step, { email: formData.email, otpExpiredTime }) : step}
                </Form>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
