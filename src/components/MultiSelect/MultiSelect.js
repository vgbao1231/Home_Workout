import { useState, memo, useRef, useEffect } from 'react';
import './MultiSelect.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

function MultiSelect({ validators = [], setFieldValue, errorMessage, setErrorMessage, children, ...props }) {
    const [isActive, setIsActive] = useState(props.value.length !== 0);
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef();

    const handleSelect = (optionValue) => {
        setErrorMessage(props.name, '');
        if (!props.value.includes(optionValue)) {
            setInputValue('');
            inputRef.current.focus();
            setFieldValue(props.name, [...props.value, optionValue]);
        }
    };

    const handleRemove = (option) => {
        setFieldValue(
            props.name,
            props.value.filter((value) => value !== option),
        );
        setIsActive(isFocused || props.value.length !== 1);
    };

    useEffect(() => {
        if (isFocused) {
            const handleClickOutside = (e) => {
                setIsFocused(false);
                setIsActive(props.value.length !== 0);
                setInputValue('');
                validators.forEach(({ check }) => {
                    if (check(props.value)) {
                        setErrorMessage(props.name, check(props.value));
                    }
                });
            };
            const handleClickBackspace = (e) => {
                if (e.key === 'Backspace') {
                    setFieldValue(props.name, props.value.slice(0, -1));
                }
            };

            const currentInputRef = inputRef.current; // Lưu giá trị hiện tại của ref

            document.addEventListener('click', handleClickOutside);
            currentInputRef.addEventListener('keydown', handleClickBackspace);

            return () => {
                document.removeEventListener('click', handleClickOutside);
                currentInputRef.removeEventListener('keydown', handleClickBackspace); // Sử dụng biến lưu ref
            };
        }
    }, [props, validators, isFocused, setErrorMessage, setFieldValue]);

    return (
        <div
            className={`field multi-select${isActive ? ' active' : ''}${errorMessage ? ' error' : ''}`}
            onClick={(e) => e.stopPropagation()}
            onFocus={() => {
                setIsFocused(true);
                setIsActive(true);
            }}
        >
            <div className="field-wrapper">
                <div className="selected-values">
                    {props.value.map((value) => (
                        <div key={value} className="selected-value center">
                            <span>{children.find((option) => option.props.value === value).props.children}</span>
                            <FontAwesomeIcon onClick={() => handleRemove(value)} icon={faX} />
                        </div>
                    ))}
                    <div className="input-wrapper">
                        <input ref={inputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                    </div>
                </div>
                <label htmlFor={props.id}>{props.label}</label>
                <fieldset>
                    <legend>
                        <span>{props.label}</span>
                    </legend>
                </fieldset>
            </div>
            {isFocused && (
                <div className="options-container">
                    {children.map(
                        (option, index) =>
                            option.props.children.includes(inputValue) && (
                                <div key={index} className="option" onClick={() => handleSelect(option.props.value)}>
                                    <span>{option.props.children}</span>
                                </div>
                            ),
                    )}
                </div>
            )}
            {errorMessage && <div className="error-msg">{errorMessage}</div>}
        </div>
    );
}

export default memo(MultiSelect);
