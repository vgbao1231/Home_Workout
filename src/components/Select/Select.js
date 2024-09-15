import { useState, memo } from 'react';
import './Select.scss';

function Select({
    validators = [],
    formatters = [],
    className = '',
    setFieldValue,
    errorMessage,
    setErrorMessage,
    iconSupport,
    options,
    ...props
}) {
    const [isActive, setIsActive] = useState(props.value);

    let events = {
        onChange: (e) => {
            setErrorMessage(props.name, '');
            setFieldValue(props.name, e.target.value);
        },
        onBlur: (e) => setIsActive(e.target.value !== ''),
        onFocus: (e) => setIsActive(true),
    };

    Object.entries({ validators, formatters }).forEach(([type, typeObjs]) => {
        typeObjs.forEach(({ event, check }) => {
            if (events[event]) {
                const originalEvent = events[event];
                events[event] = (e) => {
                    if (type === 'validators') {
                        if (originalEvent(e)) return;
                        const value = e.target.value;
                        // Xử lý validate input
                        if (check(value)) {
                            setErrorMessage(props.name, check(value));
                            return true;
                        }
                    } else {
                        e.target.value = check(e.target.value);
                        setFieldValue(props.name, e.target.value);
                        originalEvent(e);
                    }
                };
            }
        });
    });

    return (
        <div className={`${className} field select${isActive ? ' active' : ''}${errorMessage ? ' error' : ''}`}>
            <div className="field-wrapper">
                {props.readOnly ? (
                    <span>{options.find((option) => option.value === props.value)?.text}</span>
                ) : (
                    <select {...props} {...events}>
                        <option hidden></option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.text}
                            </option>
                        ))}
                    </select>
                )}
                {props.label && (
                    <>
                        <label htmlFor={props.id}>{props.label}</label>
                        <fieldset>
                            <legend>
                                <span>{props.label}</span>
                            </legend>
                        </fieldset>
                    </>
                )}
            </div>
            {errorMessage && <div className="error-msg">{errorMessage}</div>}
        </div>
    );
}

export default memo(Select);
