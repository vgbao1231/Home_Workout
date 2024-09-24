// const data = [
//     { id: 1, name: 'Push-up', muscle: ['Chest'], level: 'Beginner', basicReps: '15' },
//     { id: 2, name: 'Squat', muscle: ['Legs'], level: 'Intermediate', basicReps: '20' },
//     { id: 3, name: 'Pull-up', muscle: ['Back'], level: 'Advanced', basicReps: '10' },
//     { id: 4, name: 'Plank', muscle: ['Core'], level: 'Beginner', basicReps: '30' },
// ];

import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Input, MultiSelect, Select, Form } from '~/components';
import { formatters } from '~/utils/formatters';
import { validators } from '~/utils/validators';

function TestPage() {
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (formData) => {
        console.log(formData);
    };

    const options = [
        { value: '1', text: 'Option 1' },
        { value: '2', text: 'Option 2' },
        { value: '3', text: 'Option 3' },
        { value: '4', text: 'Option 4' },
    ];

    return (
        <div className="home">
            <Form onSubmit={handleSubmit}>
                <Input
                    name="username"
                    label="Username"
                    value="gura1231@gmail.com"
                    type="text"
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
                    // value="123123"
                    type={showPassword ? 'text' : 'password'}
                    iconSupport={{
                        icon: showPassword ? faEyeSlash : faEye,
                        handleIconClick: () => setShowPassword(!showPassword),
                    }}
                    validators={{
                        onBlur: [validators.isRequired],
                    }}
                />
                <Select
                    name="select"
                    label="Select"
                    validators={{
                        onBlur: [validators.isRequired],
                    }}
                    options={options}
                />
                <MultiSelect
                    name="multi-select"
                    label="Multiple Select"
                    validators={{
                        onBlur: [validators.isRequired],
                    }}
                    options={options}
                />
                <div className="forgot-password">
                    <a href="/forgot-password">Forgot Password?</a>
                </div>
                {null}
                <button type="submit">Submit</button>
            </Form>
        </div>
    );
}

export default TestPage;
