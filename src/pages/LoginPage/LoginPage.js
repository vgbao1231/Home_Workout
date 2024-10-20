import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input } from '~/components';
import { useDispatch } from 'react-redux';
import { addToast } from '~/redux/slices/toastSlice';
import './LoginPage.scss';
import { isEmail, isRequired } from '~/utils/validators';
import { loginThunk } from '~/redux/thunks/authThunk';
import { trimWords } from '~/utils/formatters';

function LoginPage() {
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Handle logic
    const handleLogin = async (formData) => {
        dispatch(loginThunk(formData)).then((result) => {
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
                <Form
                    onSubmit={handleLogin}
                    // defaultValues={{
                    //     email: 'root@gmail.com',
                    //     password: 'rootroot',
                    // }}
                    defaultValues={{
                        email: 'user@gmail.com',
                        password: 'useruser',
                    }}
                >
                    <Input
                        name="email"
                        label="Email"
                        validators={{
                            isRequired,
                            isEmail,
                        }}
                        formatters={{
                            onChange: [trimWords],
                        }}
                    />
                    <Input
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        iconSupport={{
                            icon: showPassword ? <EyeOff /> : <Eye />,
                            handleIconClick: () => setShowPassword(!showPassword),
                        }}
                        validators={{
                            isRequired,
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
