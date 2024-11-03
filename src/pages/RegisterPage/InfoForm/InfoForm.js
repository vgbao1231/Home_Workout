import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Input, Select } from '~/components';
import { trimWords } from '~/utils/formatters';
import { isRequired } from '~/utils/validators';
import './InfoForm.scss';

function InfoForm({ back }) {
    const gender = [
        { value: '1', text: 'Male' },
        { value: '0', text: 'Female' },
    ];
    return (
        <div className="info-form">
            <div className={'title'}>Information</div>
            <Input
                name="lastName"
                label="LastName"
                validators={{ isRequired }}
                formatters={{
                    onChange: [trimWords],
                }}
            />
            <Input
                name="firstName"
                label="FirstName"
                validators={{ isRequired }}
                formatters={{
                    onChange: [trimWords],
                }}
            />
            <Input name="dob" type="date" label="Date of Birth" />
            <Select name="genderId" label="Gender" options={gender} defaultValue="1" />
            <div className="form-button">
                <button className="center" type="button" onClick={back}>
                    <ArrowLeft />
                    <span>Back</span>
                </button>
                <button className="center" type="submit">
                    Next
                    <ArrowRight />
                </button>
            </div>
        </div>
    );
}

export default InfoForm;
