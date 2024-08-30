import PropTypes from 'prop-types';
import { useCallback, useState, useMemo } from 'react';
import Field from '../Field/Field';

function Form({ fields, btnContent, moreFeatures, onSubmit }) {
    const [errorMessage, setErrorMessage] = useState({});
    const [formData, setFormData] = useState(
        fields.reduce((acc, field) => {
            acc[field.name] = field.value || '';
            return acc;
        }, {}),
    );

    const getInputValue = useCallback((name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }, []);

    const getInputErrorMsg = useCallback((name, value) => {
        setErrorMessage((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }, []);

    const eventListeners = useMemo(() => {
        return fields.reduce((obj, field) => {
            obj[field.name] = {
                validators: field.validators || [],
                formatters: field.formatters || [],
            };
            return obj;
        }, {});
    }, [fields]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const errorObj = {};
        Object.entries(eventListeners).forEach(([field, { validators }]) => {
            validators.forEach(({ check }) => {
                if (!errorObj[field]) {
                    errorObj[field] = check(formData[field]);
                    return;
                }
            });
        });

        if (Object.values(errorObj).every((value) => !value)) {
            onSubmit(formData);
        } else {
            setErrorMessage(errorObj);
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            {fields.map(({ value, validators, formatters, ...props }) => {
                return (
                    <Field
                        key={props.name}
                        value={formData[props.name]}
                        errorMessage={errorMessage[props.name]}
                        setInputValue={getInputValue}
                        setErrorMessage={getInputErrorMsg}
                        eventListeners={eventListeners[props.name]}
                        {...props}
                    />
                );
            })}
            {moreFeatures.map((component, index) => component(index))}
            <button type="submit">{btnContent}</button>
        </form>
    );
}

Form.propTypes = {
    fields: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default Form;
