import { useCallback, useState, useMemo, Children, isValidElement, cloneElement } from 'react';
import './Form.scss';
import MultiSelect from '../MultiSelect/MultiSelect';

function Form({ children, onSubmit }) {
    const [errorMessage, setErrorMessage] = useState({});
    const fields = Children.toArray(children).filter((child) => isValidElement(child) && child.props.name);
    const [formData, setFormData] = useState(
        fields.reduce((acc, field) => {
            acc[field.props.name] = field.props.value || (field.type === MultiSelect ? [] : '');
            return acc;
        }, {}),
    );

    const getFieldValue = useCallback((name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }, []);

    const getFieldErrorMsg = useCallback((name, value) => {
        setErrorMessage((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }, []);

    const eventListeners = useMemo(() => {
        return fields.reduce((acc, field) => {
            acc[field.props.name] = {
                validators: field.props.validators || [],
                formatters: field.props.formatters || [],
            };
            return acc;
        }, {});
    }, [fields]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const errorObj = {};
        console.log(formData);
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
            {Children.map(children, (child) => {
                // Checks if child is a React element and has a name attribute
                if (isValidElement(child) && child.props.name) {
                    const { value, ...props } = child.props;
                    return cloneElement(child, {
                        value: formData[child.props.name],
                        errorMessage: errorMessage[child.props.name],
                        setFieldValue: getFieldValue,
                        setErrorMessage: getFieldErrorMsg,
                        ...props,
                    });
                }
                return child;
            })}
        </form>
    );
}

export default Form;
