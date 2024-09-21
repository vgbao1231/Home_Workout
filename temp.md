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
import './Form.scss';
import MultiSelect from '../MultiSelect/MultiSelect';

function Form({ children, className = '', onSubmit, onChange, ...props }, ref) {
    const formFieldCompos = useMemo(
        () => Children.toArray(children).filter((child) => isValidElement(child) && child.props.name),
        [children],
    );
    const initialData = useMemo(() => {
        return formFieldCompos.reduce((acc, component) => {
            acc[component.props.name] = (component.props.value !== undefined)
                ? component.props.value
                : (component.type === MultiSelect ? [] : '');
            return acc;
        }, {});
    }, [formFieldCompos]);
    const initialValidations = formFieldCompos.reduce((acc, component) => {
        acc[component.props.name] = false;
        return acc;
    }, {});

    const [currentFormData, setCurrentFormData] = useState(initialData);
    const [fieldsValidation, updateFieldsValidation] = useState(initialValidations);

    useEffect(() => {
        setCurrentFormData(initialData);
    }, [initialData]);

    const upsertCurrentFormData = useCallback((name, value) => {
        setCurrentFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        if(onChange)    onChange({ [name]: value });
    }, [onChange]);

    const fieldCompoListeners = useMemo(() => {
        return formFieldCompos.reduce((acc, component) => {
            acc[component.props.name] = {
                validators: component.props.validators || [],
                formatters: component.props.formatters || [],
            };
            return acc;
        }, {});
    }, [formFieldCompos]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (Object.values(fieldsValidation).every(validateRes -> validateRes)) {
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
                        upsertCurrentFormData: upsertCurrentFormData,
                        readOnly: props.readOnly,
                        updateFieldsValidation: updateFieldsValidation,
                        ...child.props,
                    });
                }
                return child;
            })}
        </form>
    );
}

export default memo(forwardRef(Form), (prevProps, nextProps) => {
    return prevProps.children === nextProps.children;
});

import { useState, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Input.scss';

function Input({
    validators = [],
    formatters = [],
    className = '',
    upsertCurrentFormData,
    iconSupport,
    updateFieldsValidation,
    ...props
}) {
    // console.log('input render');

    const [curValue, setCurValue] = useState(props.value);
    const [isActive, setIsActive] = useState(props.value);  //css-support
    const [errMsg, upsertErrMsg] = useState("");

    let events = {
        onBlur: (e) => setIsActive(e.target.value !== ''),
        onFocus: () => setIsActive(true),
    };

    useEffect(() => {
        validators.forEach({ eventName, check } => {
            events[eventName] = (e) => {
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
        formatters.forEach(formatter => {

        });
    }, []);

    Object.entries({ validators, formatters }).forEach(([type, typeObjs]) => {
        typeObjs.forEach(({ event, check }) => {
            if (events[event]) {
                const originalEvent = events[event];
                events[event] = (e) => {
                    if (type === 'validators') {
                        if (originalEvent(e)) return;
                        const value = e.target.value;
                        // Xử lý validate input
                        if (check(value)) {
                            upsertFieldErrMsgs(props.name, check(value));
                            return true;
                        }
                    } else {
                        e.target.value = check(e.target.value);
                        upsertCurrentFormData(props.name, e.target.value);
                        originalEvent(e);
                    }
                };
            }
        });
    });

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

export default memo(Input);
