import { Form } from '~/components';
import './RegisterPage.scss';
import { useMultistepForm } from '~/hooks/useMultiStepForm';
import InfoForm from './InfoForm/InfoForm';
import OtpForm from './OtpForm/OtpForm';
import { cloneElement, useState } from 'react';
import RegisterForm from './RegisterForm/RegisterForm';
import { AuthPublicService } from '~/services/authService';

function RegisterPage() {
    const { currentStepIndex, step, isLastStep, next } = useMultistepForm([
        <OtpForm />,
        <RegisterForm />,
        <InfoForm />,
    ]);
    const [formData, setFormData] = useState()
    const [otpExpiredTime, setOtpExpiredTime] = useState()

    // Handle logic
    const handleRegister = async (data) => {
        setFormData(data)
        // Before going to the otp form, send the api to get the otp code
        if (currentStepIndex === 1) {
            const response = await AuthPublicService.getOtp(data.email)
            setOtpExpiredTime(response.ageInSeconds);
            return next();
        }
        if (!isLastStep) return next();
        else {
            const { confirmPassword, ...formData } = data
            console.log(formData);

            AuthPublicService.register(formData)
        };
    };

    return (
        <div className="register-container center">
            <div className="register-background"></div>
            <div className="register-form">
                <Form onSubmit={handleRegister}>
                    {currentStepIndex === 2 ? cloneElement(step, { email: formData.email, otpExpiredTime }) : step}
                </Form>
            </div>
        </div>
    );
}

export default RegisterPage;
