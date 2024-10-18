import { useState, memo, useMemo } from 'react';
import './MultiSelect.scss';
import { useController, useFormContext } from 'react-hook-form';
import { X } from 'lucide-react';
import { equalsIgnoreCaseCustom } from '~/utils/formatters';

function MultiSelect({ name, validators, className = '', options, placeholder, defaultValue = [], ...rest }) {
    const { getValues, trigger, control } = useFormContext();

    const { field, fieldState: { error = {} } } = useController({
        name, control, rules: { validate: validators },
        defaultValue // This will not apply if there is a defaultValues in Form
    });

    field.value = getValues(name) ? getValues(name).map(value =>
        options.find((option) => equalsIgnoreCaseCustom(option.value, value) || equalsIgnoreCaseCustom(option.text, value))?.value
    ) : [];
    //--Built Options: {value:text, ...} instead of [{value:text}, ...]    
    const builtOptions = useMemo(() => options.reduce((acc, obj) => {
        const [value, text] = Object.values(obj);   //--obj: {text:rawText, value:rawValue}  => pairs: [rawText, rawValue]
        return { ...acc, [value]: text };
    }, {}), [options]);

    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');

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
        if (!field.value.find(selectedValue => selectedValue === newValue)) {
            field.value.push(newValue);
            field.onChange(field.value);
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
                        {field.value.map((value, index) =>
                            <div key={index} className="selected-value center">
                                <span>{builtOptions[value]}</span>
                                {isOpen && <X onClick={(e) => handleRemove(e, value)} />}
                            </div>)}
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
                        {options.map(({ value, text }, index) =>
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
