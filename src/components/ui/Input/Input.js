import { useState, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Input.scss';

function Input({
    validators = [],
    formatters = [],
    className = '',
    setFieldValue,
    setFieldError,
    errorMessage,
    iconSupport,
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

    const { icon, handleIconClick } = iconSupport || {};

    return (
        <div className={`${className} field input${isActive ? ' active' : ''}${errorMessage ? ' error' : ''}`}>
            <div className="field-wrapper">
                {props.disabled ? <span>{props.value}</span> : <input {...props} {...events} />}
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
                {icon && <FontAwesomeIcon icon={icon} onClick={handleIconClick} />}
            </div>
            {errorMessage && <div className="error-msg">{errorMessage}</div>}
        </div>
    );
}

export default memo(Input);
