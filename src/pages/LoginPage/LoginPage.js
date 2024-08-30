import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validators } from '~/utils/validators';
import './LoginPage.scss';
import { Form } from '~/components';
import { useAuth } from '~/hooks/useAuth';
import { useAuthActions } from '~/hooks/useAuthActions';

function LoginPage() {
    const { userLoggedIn } = useAuth();
    const { handleLogin, handleGoogleLogin } = useAuthActions();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Return to home page if user is already logged in
    useEffect(() => {
        console.log('userLoggedIn:', userLoggedIn);
        if (userLoggedIn) {
            navigate('/');
        }
    }, [userLoggedIn, navigate]);

    // Pass field properties to the form
    // Can be input[type="text, email, number, date, checkbox, radio, password"], select
    const fields = [
        {
            name: 'email',
            label: 'Email',
            value: 'gura1231@gmail.com',
            type: 'email',
            validators: [validators.isRequired('onChange'), validators.isEmail('onChange')],
        },
        {
            name: 'password',
            label: 'Password',
            value: '123123',
            type: showPassword ? 'text' : 'password',
            iconSupport: {
                icon: showPassword ? faEyeSlash : faEye,
                handleIconClick: () => setShowPassword(!showPassword),
            },
            validators: [validators.isRequired('onBlur')],
        },
        // More...
    ];

    const forgotPassword = (key) => {
        return (
            <div key={key} className="forgot-password">
                <Link to="/forgot-password">Forgot Password?</Link>
            </div>
        );
    };

    return (
        <div className="login-container center">
            <div className="login-background"></div>
            <div className={'login-form'}>
                <div className={'login-title'}>Login</div>
                <Form fields={fields} btnContent="Login" moreFeatures={[forgotPassword]} onSubmit={handleLogin} />
                <div className="divider-container center">
                    <div className="divider-line"></div>
                    <span className="divider-text"> or login with </span>
                    <div className="divider-line"></div>
                </div>
                <div className="login-social">
                    <button className="google-btn center" onClick={handleGoogleLogin}>
                        <img src="https://img.icons8.com/color/40/google-logo.png" alt="google-logo" />
                        <span>Login with google</span>
                    </button>
                    <button className="facebook-btn center" onClick={handleGoogleLogin}>
                        <img src="https://img.icons8.com/fluency/48/facebook-new.png" alt="facebook-new" />
                        <span>Login with facebook</span>
                    </button>
                </div>
                <div className="register center">
                    Don't have an account yet?
                    <Link to="/register">Register</Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
