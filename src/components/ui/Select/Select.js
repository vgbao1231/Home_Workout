import { memo } from 'react';
import './Select.scss';
import { useController, useFormContext } from 'react-hook-form';

function Select({ name, className = '', validators = {}, formatters = {}, options, defaultValue = '', ...rest }) {
    const { getValues, control } = useFormContext();
    const {
        field,
        fieldState: { error = {} },
    } = useController({
        name,
        control,
        rules: { validate: validators },
        defaultValue: getValues(name) || defaultValue, // Get default value from Form, if not, get from props
    });

    console.log(error.message ? 'Render: error' : 'Render: select');

    // Filter out props that are events with the prefix 'on'
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

    const eventNames = [...new Set([...Object.keys(formatters), ...Object.keys(events)])];
    const eventHandlers = Object.fromEntries(
        eventNames.map((eventName) => [eventName, (e) => handleEvent(eventName, e)]),
    );

    // Handle format value by event
    const handleEvent = (eventName, e) => {
        let currentValue = e.target.value;
        if (formatters[eventName]) {
            currentValue = formatters[eventName].reduce((acc, formatter) => formatter(acc), currentValue);
        }
        events[eventName] && events[eventName](e);
        field[eventName](currentValue); // Call event from field again so that it wont be overwritten by events
    };

    return (
        <div
            className={`${className} field select${error.message ? ' error' : ''}`}
            data-active={!!field.value}
            {...props}
        >
            <div className="field-wrapper">
                {props.disabled ? (
                    <span>{options.find((option) => option.raw === field.value)?.text}</span>
                ) : (
                    <select {...field} {...eventHandlers} {...props}>
                        <option value="" hidden>
                            {props.placeholder}
                        </option>
                        {options.map((option, index) => (
                            <option key={index} value={option.raw}>
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
            {error.message && <div className="error-msg">{error.message}</div>}
        </div>
    );
}

export default memo(Select);
