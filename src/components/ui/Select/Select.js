import { useState, memo } from 'react';
import './Select.scss';

function Select({
    validators = [],
    formatters = [],
    className = '',
    setFieldValue,
    setFieldError,
    errorMessage,
    iconSupport,
    options,
    ...props
}) {
    const [isActive, setIsActive] = useState(props.value);

    let rootEvents = {
        onChange: (value) => {
            setFieldValue([props.name], value);
        },
        onBlur: (value) => setIsActive(value !== ''),
        onFocus: () => setIsActive(true),
    };

    let eventNames = new Set([...Object.keys(rootEvents), ...Object.keys(validators), ...Object.keys(formatters)]);
    let events = [...eventNames].reduce((acc, eventName) => {
        acc[eventName] = (e) => {
            validators[eventName] &&
                validators[eventName].forEach((validator) => {
                    setFieldError([props.name], '');
                    validator(e.target.value) && setFieldError([props.name], validator(e.target.value));
                });
            formatters[eventName] && formatters[eventName].forEach((formatter) => formatter(e.target.value));
            rootEvents[eventName] && rootEvents[eventName](e.target.value);
        };
        return acc;
    }, {});

    return (
        <div className={`${className} field select${isActive ? ' active' : ''}${errorMessage ? ' error' : ''}`}>
            <div className="field-wrapper">
                {props.disabled ? (
                    <span>{options.find((option) => option.value == props.value)?.text}</span>
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
