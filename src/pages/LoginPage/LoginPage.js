import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validators } from '~/utils/validators';
import { Form, Input } from '~/components';
import { useDispatch } from 'react-redux';
import { loginThunk } from '~/store/authSlice';
import { addToast } from '~/store/toastSlice';
import './LoginPage.scss';
import { formatters } from '~/utils/formatters';

function LoginPage() {
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Handle logic
    const handleLogin = async ({ username, password }) => {
        dispatch(loginThunk(username, password)).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/');
                dispatch(addToast(result.payload.message, 'success'));
            } else {
                dispatch(addToast(result.payload.message, 'error'));
            }
        });
    };

    return (
        <div className="login-container center">
            <div className="login-background"></div>
            <div className="login-form">
                <div className={'login-title'}>Login</div>
                <Form onSubmit={handleLogin}>
                    <Input
                        name="username"
                        label="Username"
                        value="gura1231@gmail.com"
                        validators={{
                            onBlur: [validators.isRequired],
                            onChange: [validators.isEmail],
                        }}
                        formatters={{
                            onChange: [formatters.capitalizeWords],
                        }}
                    />
                    <Input
                        name="password"
                        label="Password"
                        value="123123"
                        type={showPassword ? 'text' : 'password'}
                        iconSupport={{
                            icon: showPassword ? faEyeSlash : faEye,
                            handleIconClick: () => setShowPassword(!showPassword),
                        }}
                        validators={{
                            onBlur: [validators.isRequired],
                        }}
                    />
                    <div className="forgot-password">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                    <button type="submit">Login</button>
                    <div className="divider-container center">
                        <div className="divider-line"></div>
                        <span className="divider-text"> or login with </span>
                        <div className="divider-line"></div>
                    </div>
                    <div className="login-social">
                        <button className="google-btn center" onClick={handleLogin}>
                            <img src="https://img.icons8.com/color/40/google-logo.png" alt="google-logo" />
                            <span>Login with google</span>
                        </button>
                        <button className="facebook-btn center" onClick={handleLogin}>
                            <img src="https://img.icons8.com/fluency/48/facebook-new.png" alt="facebook-new" />
                            <span>Login with facebook</span>
                        </button>
                    </div>
                    <div className="register center">
                        Don't have an account yet?
                        <Link to="/register">Register</Link>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default LoginPage;
