import { Form } from '~/components';
import './RegisterPage.scss';
import { useMultistepForm } from '~/hooks/useMultiStepForm';
import InfoForm from './InfoForm/InfoForm';
import OtpForm from './OtpForm/OtpForm';
import { cloneElement } from 'react';
import RegisterForm from './RegisterForm/RegisterForm';

function RegisterPage() {
    const { currentStepIndex, step, isLastStep, next } = useMultistepForm([
        <RegisterForm />,
        <InfoForm />,
        <OtpForm />,
    ]);

    // Handle logic
    const handleRegister = async (formData) => {
        // Before going to the otp form, send the api to get the otp code
        if (currentStepIndex === 1) {
            console.log('call api get otp');
            return next();
        }
        if (!isLastStep) return next();
        else {
            console.log(formData);
        }
    };

    return (
        <div className="register-container center">
            <div className="register-background"></div>
            <div className="register-form">
                <Form onSubmit={handleRegister}>
                    {currentStepIndex === 2 ? cloneElement(step, { otp: '1231' }) : step}
                </Form>
            </div>
        </div>
    );
}

export default RegisterPage;
