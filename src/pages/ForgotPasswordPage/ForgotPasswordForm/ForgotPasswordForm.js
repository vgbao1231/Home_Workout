
import { Input } from '~/components';
import { trimWords } from '~/utils/formatters';
import { isEmail, isRequired } from '~/utils/validators';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './ForgotPasswordForm.scss'
import { useNavigate } from 'react-router-dom';

function RorgotPasswordForm({ back, next }) {
    const navigate = useNavigate()
    return (
        <div className="forgot-password-form">
            <div className={'title'}>Forgot Password</div>
            <span>*Enter your email to receive an OTP for password reset</span>
            <Input
                name="email"
                label="Email"
                validators={{ isRequired, isEmail }}
                formatters={{
                    onChange: [trimWords],
                }}
            />
            <div className="form-button">
                <button className="center" type="button" onClick={() => navigate('/login')}>
                    <ArrowLeft />
                    <span>Back</span>
                </button>
                <button className="center" type="submit">
                    <span>Next</span>
                    <ArrowRight />
                </button>
            </div>
        </div>
    );
}

export default RorgotPasswordForm;
