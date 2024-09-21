import {
    useCallback,
    useState,
    useMemo,
    Children,
    isValidElement,
    cloneElement,
    forwardRef,
    memo,
    useEffect,
} from 'react';
import { useState, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Input.scss';
import './Form.scss';
import MultiSelect from '../MultiSelect/MultiSelect';

function Form({ children, className = '', onSubmit, onChange, ...props }, ref) {
    const formFieldCompos = useMemo(() => 
        Children.toArray(children).filter((child) => isValidElement(child) && child.props.name)
    , [children]);
    const initialData = useMemo(() => {
        return formFieldCompos.reduce((acc, component) => {
            acc[component.props.name] = (component.props.value !== undefined)
                ? component.props.value
                : (component.type === MultiSelect ? [] : '');
            return acc;
        }, {});
    }, [formFieldCompos]);
    const initialValidations = useEffect(() => {
        return formFieldCompos.reduce((acc, component) => {
            acc[component.props.name] = false;
            return acc;
        }, {});
    }, []);

    const [currentFormData, setCurrentFormData] = useState(initialData);
    const [fieldsValidation, updateFieldsValidation] = useState(initialValidations);

    const upsertFormDataByField = useCallback((name, value) => {
        setCurrentFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }, [onChange]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (Object.values(fieldsValidation).every(validateRes => validateRes)) {
            onSubmit(currentFormData);
        } else {
            //toast
        }
    };

    return (
        <form className={`${className} form`} onSubmit={handleSubmit} ref={ref} {...props}>
            {Children.map(children, (child) => {
                // Checks if child is a React element and has a name attribute
                if (isValidElement(child) && child.props.name) {
                    return cloneElement(child, {
                        value: currentFormData[child.props.name],
                        upsertFormDataByField: upsertFormDataByField,
                        readOnly: props.readOnly,
                        updateFieldsValidation: updateFieldsValidation,
                        ...child.props, //--validators, formatters,...
                    });
                }
                return child;
            })}
        </form>
    );
}

function Input({
    validators = [],
    formatters = [],
    className = '',
    upsertFormDataByField,
    iconSupport,
    updateFieldsValidation,
    ...props
}) {
    // console.log('input render');

    const [curValue, setCurValue] = useState(props.value);
    const [errMsg, upsertErrMsg] = useState("");

    let events = {};

    useEffect(() => {
        var events = validators.forEach(({ event, check }) => {
            events[event] = (e) => {
                const errMsg = check(e.target.value);
                if (errMsg) {
                    upsertErrMsg(errMsg);
                    updateFieldsValidation[props.name] = false;
                } else {
                    upsertErrMsg("");
                    updateFieldsValidation[props.name] = true;
                }        
            };
        });
        formatters.forEach(({ event, check }) => {
            events[event] = (e) => setCurValue(previous => check(previous));
        });
    }, []);

    const { icon, handleIconClick } = iconSupport || {};

    return (
        <div className={`${className} field input${isActive ? ' active' : ''}${errMsg ? ' error' : ''}`}>
            <div className="field-wrapper">
                {props.readOnly ? <span>{props.value}</span> : <input {...props} {...events} value={curValue}/>}
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
                {icon && <FontAwesomeIcon icon={icon} onClick={handleIconClick} />}
            </div>
            {errMsg && <div className="error-msg">{errMsg}</div>}
        </div>
    );
}