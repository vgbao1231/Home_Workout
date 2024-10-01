import './TestPage.scss'; // Giữ lại để đảm bảo styles được áp dụng
import { isRequired } from '~/utils/validators';
import { Input, MultiSelect, Select, Form } from '~/components';
import { formatters } from '~/utils/formatters';

function TestPage() {
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
                    type="text"
                    validators={{
                        isRequired,
                    }}
                    formatters={{
                        onChange: [formatters.capitalizeWords],
                    }}
                />

                <Select
                    name="select"
                    label="Select"
                    validators={{
                        isRequired,
                    }}
                    options={options}
                />
                <MultiSelect
                    name="multi-select"
                    label="Multiple Select"
                    validators={{
                        isRequired,
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
