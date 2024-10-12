import { useState, memo, useCallback, useEffect, useMemo } from 'react';
import './MultiSelect.scss';
import { useController, useFormContext } from 'react-hook-form';
import { X } from 'lucide-react';

function MultiSelect({ name, validators, className = '', options, placeholder, defaultValue = [], ...rest }) {
    const { getValues, trigger, control } = useFormContext();
    const setupDefaultValuesWithObjectFormat = useCallback((defaultValue, options) => {
        if (!defaultValue || defaultValue.length == 0) return defaultValue;

        //--Create UpperCased Variables
        const tempInitialValue = typeof defaultValue[0] == "string"
            ? defaultValue.map(value => value.toUpperCase())
            : defaultValue;
        const upperCaseEngine = typeof options[0]["text"] == "string"
            ? str => str.toUpperCase()
            : str => str;
        return options.reduce((acc, { text, value }, index) =>
            tempInitialValue.includes(upperCaseEngine(text)) ? [...acc, value] : acc
        , []);
    }, []);

    const {
        field,
        fieldState: { error = {} },
    } = useController({
        name,
        control,
        rules: { validate: validators },
        defaultValue: setupDefaultValuesWithObjectFormat(defaultValue, options), // Get default value from Form, if not, get from props
    });
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    //--Built Options: {value:text, ...} instead of [{value:text}, ...]    
    const builtOptions = useMemo(() => options.reduce((acc, obj) => {
        const [text, value] = Object.values(obj);   //--obj: {text:rawText, value:rawValue}  => pairs: [rawText, rawValue]
        return { ...acc, [value]: text };
    }, {}), [options]);

    // console.log(error.message ? 'Render: error' : 'Render: multi');

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

    const toggleDropdown = () => {
        if (!props.disabled) {
            setIsOpen(true);
        }
    };

    const handleSelect = (newValue) => {
        if (!field.value.find(value => value === newValue)) {
            setInputValue('');
            field.value.push(newValue);
            field.onChange(field.value);
            events.onChange && events.onChange(field.value);
        }
    };

    const handleRemove = (e, rmvValue) => {
        e.stopPropagation();
        const updatedValues = field.value.filter(value => rmvValue !== value);
        field.onChange(updatedValues);
        setInputValue('');
        events.onChange && events.onChange(updatedValues);
    };


    const handlePopElementByBackspace = (e) => {
        if (e.key === 'Backspace' && !inputValue) {
            const updatedValues = field.value.slice(0, -1);
            field.onChange(updatedValues);
            events.onChange && events.onChange(updatedValues);
        }
    }

    const handleClickOutside = () => {
        setIsOpen(false);
        setInputValue('');
        validators && trigger(name);
        events.onBlur && events.onBlur(getValues(name));
    };

    return (
        <>
            <div
                className={`${className} field multi-select${isOpen ? ' open' : ''}${error.message ? ' error' : ''}`}
                data-active={!!field.value.length || isOpen}
                {...events}
                {...props}
            >
                <div className={`field-wrapper`} onClick={toggleDropdown}>
                    <div className="selected-values">
                        {!field.value.length && <span className="placeholder">{placeholder}</span>}
                        {field.value.map((value, index) => (
                            <div key={index} className="selected-value center">
                                <span>{builtOptions[value]}</span>
                                {isOpen && <X onClick={(e) => handleRemove(e, value)} />}
                            </div>
                        ))}
                        {!props.disabled && isOpen && (
                            <div className="input-wrapper">
                                <input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handlePopElementByBackspace}
                                    disabled={props.disabled}
                                    hidden={!isOpen}
                                    autoFocus={isOpen}
                                />
                            </div>
                        )}
                    </div>
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
                {isOpen && (
                    <div className="options-container">
                        {options.map(({ text, value }, index) =>
                            text.toLowerCase().includes(inputValue.toLowerCase()) && (
                                <div key={index} className="option" onClick={() => handleSelect(value)}>
                                    <span>{text}</span>
                                </div>
                            ),
                        )}
                    </div>
                )}
                {error.message && <div className="error-msg">{error.message}</div>}
                {isOpen && (
                    <div
                        className="multi-select-overlay"
                        onClick={handleClickOutside}
                        onContextMenu={(e) => e.stopPropagation()}
                    ></div>
                )}
            </div>
        </>
    );
}

export default memo(MultiSelect);
