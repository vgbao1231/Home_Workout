import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '~/components';
import { trimWords } from '~/utils/formatters';
import { isEmail, isRequired, minLength } from '~/utils/validators';

function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');

    return (
        <>
            <div className={'title'}>Register</div>
            <Input
                name="email"
                label="Email"
                validators={{ isRequired, isEmail }}
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
                validators={{ isRequired, minlength: minLength(6) }}
                formatters={{
                    onChange: [trimWords],
                }}
                onChange={(e) => setPassword(e.target.value)}
            />
            {password && (
                <Input
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    iconSupport={{
                        icon: showConfirmPassword ? <EyeOff /> : <Eye />,
                        handleIconClick: () => setShowConfirmPassword(!showConfirmPassword),
                    }}
                    validators={{
                        isRequired,
                        validatePassword: (value) => (password === value ? undefined : 'Password does not match'),
                    }}
                    formatters={{
                        onChange: [trimWords],
                    }}
                />
            )}
            <button type="submit">Continue</button>
            <div className="divider-container center">
                <div className="divider-line"></div>
                <span className="divider-text"> or register with </span>
                <div className="divider-line"></div>
            </div>
            <div className="register-social">
                <button className="google-btn" onClick={() => { }}>
                    <img src="https://img.icons8.com/color/40/google-logo.png" alt="google-logo" />
                    <span>Register with google</span>
                </button>
                <button className="facebook-btn" onClick={() => { }}>
                    <img src="https://img.icons8.com/fluency/48/facebook-new.png" alt="facebook-new" />
                    <span>Register with facebook</span>
                </button>
            </div>
            <div className="register center">
                Already have an account?
                <Link to="/login">Log in</Link>
            </div>
        </>
    );
}

export default RegisterForm;
