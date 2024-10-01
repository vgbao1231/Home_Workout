import { cloneElement, memo } from 'react';
import './Input.scss';
import { useFormContext } from 'react-hook-form';

function Input({ name, id, className = '', validators = {}, formatters = {}, iconSupport, ...props }) {
    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext();

    const fieldValue = watch(name) || ''; // Watch field value in realtime

    // Create format event listener
    const formatEvents = Object.keys(formatters).reduce((acc, eventName) => {
        acc[eventName] = (e) => handleFormatEvent(eventName, e);
        return acc;
    }, {});

    // Handle format value by event
    const handleFormatEvent = (eventType, e) => {
        let currentValue = e;
        if (e.target) {
            // Format value if there are formatters for eventType
            currentValue = e.target.value;
            if (formatters && formatters[eventType]) {
                currentValue = formatters[eventType].reduce((val, formatter) => formatter(val), e.target.value);
            }
            setValue(name, currentValue);
        }
    };

    const { icon, handleIconClick } = iconSupport || {};
    return (
        <div
            className={`${className ? className : ''} field input${errors[name] ? ' error' : ''}`}
            data-active={!!fieldValue}
            {...props}
        >
            <div className="field-wrapper">
                {props.disabled ? (
                    <span>{fieldValue}</span>
                ) : (
                    <input
                        {...register(name, {
                            validate: {
                                ...validators,
                            },
                            ...formatEvents, // format by event
                        })}
                        placeholder=""
                        id={id}
                        {...props}
                    />
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
                {icon && cloneElement(icon, { onClick: handleIconClick })}
            </div>
            {errors[name] && <div className="error-msg">{errors[name].message}</div>}
        </div>
    );
}

export default memo(Input);
