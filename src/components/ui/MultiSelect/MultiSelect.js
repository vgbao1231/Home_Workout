import { useState, memo, useRef, useEffect } from 'react';
import './MultiSelect.scss';
import { useFormContext } from 'react-hook-form';
import { X } from 'lucide-react';

function MultiSelect({ name, validators, className = '', options, placeholder, ...props }) {
    const {
        register,
        unregister,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext(); // Lấy register và setValue từ context
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);

    const fieldValue = watch(name) || []; // Watch field value in realtime
    useEffect(() => {
        register(name, {
            validate: {
                ...validators,
            },
        });
        fieldValue.length === 0 && setValue(name, []);
    }, [register, unregister, name, validators, setValue, fieldValue.length]);

    const toggleDropdown = () => {
        if (!props.disabled) {
            inputRef.current && inputRef.current.focus();
            setIsOpen(true);
        }
    };

    const handleSelect = (value) => {
        if (!fieldValue.includes(value)) {
            setInputValue('');
            inputRef.current && inputRef.current.focus();
            const updatedValues = [...fieldValue, value];
            setValue(name, updatedValues); // Cập nhật giá trị vào form ***
        }
    };

    const handleRemove = (e, value) => {
        e.stopPropagation();
        const updatedValues = fieldValue.filter((item) => item !== value);
        setValue(name, updatedValues);
        setInputValue('');
    };

    const handleBackspace = (e) => {
        if (e.key === 'Backspace' && !inputValue) {
            const updatedValues = fieldValue.slice(0, -1);
            setValue(name, updatedValues);
        }
    };

    const handleClickOutside = () => {
        setIsOpen(false);
        setInputValue('');
    };

    return (
        <>
            <div
                className={`${className} field multi-select${isOpen ? ' open' : ''}${errors[name] ? ' error' : ''}`}
                data-active={!!fieldValue.length || isOpen}
                {...props}
            >
                <div className={`field-wrapper`} onClick={toggleDropdown}>
                    <div className="selected-values">
                        {!fieldValue.length && <span className="placeholder">{placeholder}</span>}
                        {fieldValue.map((value, index) => (
                            <div key={index} className="selected-value center">
                                <span>{options.find((option) => option.value === value)?.text}</span>
                                {isOpen && <X onClick={(e) => handleRemove(e, value)} />}
                            </div>
                        ))}
                        {!props.disabled && isOpen && (
                            <div className="input-wrapper">
                                <input
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleBackspace}
                                    disabled={props.disabled}
                                    hidden={!isOpen}
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
                            (option, index) =>
                                option.text.toLowerCase().includes(inputValue.toLowerCase()) && (
                                    <div key={index} className="option" onClick={() => handleSelect(option.value)}>
                                        <span>{option.text}</span>
                                    </div>
                                ),
                        )}
                    </div>
                )}
                {errors[name] && <div className="error-msg">{errors[name].message}</div>}
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
