import {
    useCallback,
    useState,
    useMemo,
    Children,
    isValidElement,
    cloneElement,
    forwardRef,
    memo,
    useEffect,
} from 'react';
import './Form.scss';
import MultiSelect from '../MultiSelect/MultiSelect';

function Form({ children, className = '', onSubmit, ...props }, ref) {
    console.log('form');
    // Retrieve children with prop name
    const formFields = useMemo(
        () => Children.toArray(children).filter((child) => isValidElement(child) && child.props.name),
        [children],
    );
    const { initialFormData, initialFormErrors, formValidators } = useMemo(() => {
        return formFields.reduce(
            (acc, field) => {
                const { name, value, validators = {} } = field.props;

                // Create initial form data from formFields
                acc.initialFormData[name] = value !== undefined ? value : field.type === MultiSelect ? [] : '';

                // Create initial form error messages from formFields
                acc.initialFormErrors[name] = '';

                // Get validator of each field from formFields
                acc.formValidators[name] = Object.values(validators).flat() || [];

                return acc;
            },
            {
                initialFormData: {},
                initialFormErrors: {},
                formValidators: {},
            },
        );
    }, [formFields]);

    // useEffect(() => {
    //     setFormData(initialFormData);
    // }, [initialFormData]);

    // Form state
    const [formErrors, setFormErrors] = useState(initialFormErrors);
    const [formData, setFormData] = useState(initialFormData);

    const setFieldValue = useCallback((name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }, []);

    const setFieldError = useCallback((name, value) => {
        setFormErrors((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }, []);

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Temporary object to hold new formErrors
        const newFormErrors = {};
        Object.entries(formValidators).forEach(([field, validators]) => {
            for (let validator of validators) {
                const errorMessage = validator(formData[field]);
                if (errorMessage) {
                    newFormErrors[field] = errorMessage; // Save the first error message
                    break; // Stop checking other validators
                } else {
                    newFormErrors[field] = '';
                }
            }
        });

        // If there are no errors (all formErrors values ​​are empty) then submit
        if (Object.values(newFormErrors).every((value) => value === '')) {
            onSubmit(formData);
        } else {
            // Update formErrors state after validators have run
            setFormErrors(newFormErrors);
        }
    };

    return (
        <form className={`form ${className}`} onSubmit={handleFormSubmit} ref={ref} {...props}>
            {Children.map(children, (child) => {
                // Checks if child is a React element and has a name attribute
                if (isValidElement(child) && child.props.name) {
                    return cloneElement(child, {
                        ...child.props,
                        value: formData[child.props.name],
                        errorMessage: formErrors[child.props.name],
                        setFieldValue: setFieldValue,
                        setFieldError: setFieldError,
                        disabled: props.disabled,
                    });
                }
                return child;
            })}
        </form>
    );
}

export default memo(forwardRef(Form));
