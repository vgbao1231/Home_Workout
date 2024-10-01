import { memo } from 'react';
import './Select.scss';
import { useFormContext } from 'react-hook-form';

function Select({ name, className = '', validators = {}, formatters = {}, options, ...props }) {
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

    return (
        <div
            className={`${className} field select${errors[name] ? ' error' : ''}`}
            data-active={!!fieldValue}
            {...props}
        >
            <div className="field-wrapper">
                {props.disabled ? (
                    <span>{options.find((option) => String(option.value) === String(fieldValue))?.text}</span>
                ) : (
                    <select
                        {...register(name, {
                            validate: {
                                ...validators,
                            },
                            ...formatEvents, // format by event
                        })}
                        {...props}
                    >
                        <option value="" hidden>
                            {props.placeholder}
                        </option>
                        {options.map((option, index) => (
                            <option key={index} value={option.value}>
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
            {errors[name] && <div className="error-msg">{errors[name].message}</div>}
        </div>
    );
}

export default memo(Select);
