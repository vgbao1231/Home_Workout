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

function Form({ children, className = '', onSubmit, onChange, ...props }, ref) {
    // console.log('form render');
    const fields = Children.toArray(children).filter((child) => isValidElement(child) && child.props.name);
    const getInitialData = useCallback(() => {
        const initialData = fields.reduce((acc, field) => {
            acc[field.props.name] = field.props.value || (field.type === MultiSelect ? [] : '');
            return acc;
        }, {});
        return initialData;
    }, [fields]);

    const [errorMessage, setErrorMessage] = useState({});
    const [formData, setFormData] = useState(getInitialData);

    useEffect(() => {
        setFormData(getInitialData);
    }, [getInitialData]);

    const getFieldValue = useCallback(
        (name, value) => {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
            onChange && onChange({ [name]: value });
        },
        [onChange],
    );

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
        <form className={`${className} form`} onSubmit={handleSubmit} ref={ref} {...props}>
            {Children.map(children, (child) => {
                // Checks if child is a React element and has a name attribute
                if (isValidElement(child) && child.props.name) {
                    return cloneElement(child, {
                        value: child.props.value || formData[child.props.name],
                        errorMessage: errorMessage[child.props.name],
                        setFieldValue: getFieldValue,
                        setErrorMessage: getFieldErrorMsg,
                        readOnly: props.readOnly,
                        ...child.props,
                    });
                }
                return child;
            })}
        </form>
    );
}

export default memo(forwardRef(Form), (prevProps, nextProps) => {
    // So sánh props cũ và mới
    return prevProps.children === nextProps.children;
});
