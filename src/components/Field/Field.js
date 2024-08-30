import { useState, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Field.scss';

function Field({ eventListeners = {}, setInputValue, errorMessage, setErrorMessage, iconSupport, ...props }) {
    const [isActive, setIsActive] = useState(props.value);

    let events = {
        onChange: (e) => {
            setErrorMessage(props.name, '');
            setInputValue(props.name, e.target.value);
        },
        onBlur: (e) => setIsActive(e.target.value !== ''),
        onFocus: (e) => setIsActive(true),
    };

    Object.entries(eventListeners).forEach(([type, typeObjs]) => {
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
                        setInputValue(props.name, e.target.value);
                        originalEvent(e);
                    }
                };
            }
        });
    });

    const { icon, handleIconClick } = iconSupport || {};

    return (
        <div className="field">
            <div className={`field-wrapper center ${isActive ? 'active' : ''} ${errorMessage ? 'error' : ''}`}>
                {props.type === 'select' ? (
                    <select {...props} {...events}>
                        <option hidden></option>
                        {props.options.map((option, index) => (
                            <option key={index} value={option.value} selected={option.selected}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input {...props} {...events} />
                )}
                <label htmlFor={props.id}>{props.label}</label>
                <fieldset>
                    <legend>
                        <span>{props.label}</span>
                    </legend>
                </fieldset>
                {icon && <FontAwesomeIcon icon={icon} onClick={handleIconClick} />}
            </div>
            {errorMessage && <div className="error-msg">{errorMessage}</div>}
        </div>
    );
}

export default memo(Field);
