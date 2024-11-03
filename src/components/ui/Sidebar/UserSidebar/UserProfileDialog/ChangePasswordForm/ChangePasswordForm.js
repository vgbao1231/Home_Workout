import { useState } from "react";
import Input from "~/components/ui/Input/Input";
import { trimWords } from "~/utils/formatters";
import { isRequired, minLength } from "~/utils/validators";
import { Eye, EyeOff } from "lucide-react";
function ChangePasswordForm() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    return (
        <>
            <Input
                name="currentPassword"
                label="Current Password"
                type={showCurrentPassword ? 'text' : 'password'}
                iconSupport={{
                    icon: showCurrentPassword ? <EyeOff /> : <Eye />,
                    handleIconClick: () => setShowCurrentPassword(!showCurrentPassword),
                }}
                validators={{ isRequired, minlength: minLength(6) }}
                formatters={{
                    onChange: [trimWords],
                }}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Input
                name="newPassword"
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                iconSupport={{
                    icon: showNewPassword ? <EyeOff /> : <Eye />,
                    handleIconClick: () => setShowNewPassword(!showNewPassword),
                }}
                validators={{ isRequired, minlength: minLength(6) }}
                formatters={{
                    onChange: [trimWords],
                }}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Input
                name="confirmPassword"
                label="Confirm New Password"
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
            <button type="submit" className="btn">Continue</button>
        </>
    )
}
export default ChangePasswordForm