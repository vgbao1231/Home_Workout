import { cloneElement, memo } from 'react';
import './Input.scss';
import { useController, useFormContext } from 'react-hook-form';

function Input({ name, className = '', validators = {}, formatters = {}, iconSupport, defaultValue = '', ...rest }) {
    const { control } = useFormContext();
    const { field: { value, ...field }, fieldState: { error = {} } } = useController({
        name, control, rules: { validate: validators },
        defaultValue: defaultValue, // This will not apply if there is a defaultValues in Form
    });

    // Filter out props and events
    const { events, props } = Object.keys(rest).reduce(
        (acc, key) => {
            if (typeof rest[key] === 'function' && key.startsWith('on')) {
                acc.events[key] = rest[key];
            } else {
                acc.props[key] = rest[key];
            }
            return acc;
        },
        { events: {}, props: {} },
    );

    // Include 'onChange', 'onBlur' from field (RHF)
    const eventNames = [...new Set([...Object.keys(formatters), ...Object.keys(events), 'onChange', 'onBlur'])];
    const eventHandlers = Object.fromEntries(
        eventNames.map((eventName) => [eventName, (e) => handleEvent(eventName, e)]),
    );

    // Handle format value by event
    const handleEvent = (eventName, e) => {
        // Check if it is an input type file
        if (props.type === 'file') {
            field.onChange(e.target.files);
        } else {
            if (formatters[eventName]) {
                const currentValue = formatters[eventName].reduce((acc, formatter) => formatter(acc), e.target.value);
                field.onChange(currentValue);
            } else if (field[eventName]) {
                field[eventName](e.target.value);
            }
        }
        if (events[eventName]) {
            events[eventName](e);
        }
    };

    const { icon, handleIconClick } = iconSupport || {};
    return (
        <div
            className={`${className ? className : ''} field input${error.message ? ' error' : ''}`}
            data-active={!!value}
        >
            <div className="field-wrapper">
                {props.disabled ? (
                    <span>{value}</span>
                ) : props.type !== 'file' ? (
                    // Add value if type is not file
                    <input
                        value={value}
                        {...props}
                        {...field}
                        {...eventHandlers}
                        checked={props.type === 'radio' && props.value === value}
                    />
                ) : (
                    <input {...props} {...field} {...eventHandlers} />
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
                {icon && cloneElement(icon, { onClick: handleIconClick, className: 'input-icon' })}
            </div>
            {error.message && <div className="error-msg">{error.message}</div>}
        </div>
    );
}

export default memo(Input);
