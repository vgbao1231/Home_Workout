import { useState, memo, useRef } from 'react';
import './MultiSelect.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

function MultiSelect({
    validators = {},
    className = '',
    setFieldValue,
    setFieldError,
    errorMessage,
    options,
    value = [],
    ...props
}) {
    const [isActive, setIsActive] = useState(value.length);
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const multiSelectRef = useRef();
    const inputRef = useRef();

    const toggleDropdown = () => {
        if (!props.disabled) {
            inputRef.current && inputRef.current.focus();
            setIsActive(true);
            setIsOpen(true);
        }
    };

    const handleSelect = (optionValue) => {
        setFieldError(props.name, '');
        if (!value.includes(optionValue)) {
            setInputValue('');
            inputRef.current && inputRef.current.focus();
            setFieldValue(props.name, [...value, optionValue]);
        }
    };

    const handleRemove = (e, option) => {
        e.stopPropagation();
        console.log('handleRemove');
        const newValue = value.filter((value) => value !== option);
        setFieldValue(props.name, newValue);
        setIsActive(isOpen || newValue.length);
        setInputValue('');
    };

    const handleBackspace = (e) => {
        if (e.key === 'Backspace' && !inputValue) {
            setFieldValue(props.name, value.slice(0, -1));
        }
    };

    const handleClickOutside = () => {
        setIsOpen(false);
        setIsActive(value.length !== 0);
        setInputValue('');
        Object.values(validators).forEach((eventValidators) => {
            eventValidators.forEach((validator) => {
                const error = validator(value.length);
                error && setFieldError([props.name], error);
            });
        });
    };

    return (
        <>
            <div
                ref={multiSelectRef}
                className={`${className} field multi-select${isActive ? ' active' : ''}${isOpen ? ' open' : ''}${
                    errorMessage ? ' error' : ''
                }`}
            >
                <div className={`field-wrapper`} onClick={toggleDropdown}>
                    <div className="selected-values">
                        {value.map((value) => (
                            <div key={value} className="selected-value center">
                                <span>{options.find((option) => option.value === value)?.text}</span>
                                {!props.disabled && (
                                    <FontAwesomeIcon onClick={(e) => handleRemove(e, value)} icon={faX} />
                                )}
                            </div>
                        ))}
                        {!props.disabled && (
                            <div className="input-wrapper">
                                <input
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleBackspace}
                                    disabled={props.disabled}
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
                        {options.map(
                            (option) =>
                                option.text.toLowerCase().includes(inputValue.toLowerCase()) && (
                                    <div
                                        key={option.value}
                                        className="option"
                                        onClick={() => handleSelect(option.value)}
                                    >
                                        <span>{option.text}</span>
                                    </div>
                                ),
                        )}
                    </div>
                )}
                {errorMessage && <div className="error-msg">{errorMessage}</div>}
            </div>
            {isOpen && <div className="multi-select-overlay" onClick={handleClickOutside}></div>}
        </>
    );
}

export default memo(MultiSelect);
