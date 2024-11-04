import { forwardRef, memo, useCallback, useEffect } from 'react';
import './Form.scss';
import { FormProvider, useForm } from 'react-hook-form';

function Form({ children, className = '', defaultValues, mode, methods, onSubmit, confirm, ...props }, ref) {
    const internalMethods = useForm({
        defaultValues: defaultValues || {}, // Default values for all fields
        mode: mode || 'all', // Validate on change, blur and submit
    });

    const formMethods = methods || internalMethods;

    // Reset form when there is new default data
    useEffect(() => {
        !Array.isArray(defaultValues) && formMethods.reset(defaultValues); // Reset form with new default data
    }, [defaultValues, formMethods]);

    const handleSubmit = useCallback(
        (data) => {
            const isChanged = JSON.stringify(data) !== JSON.stringify(defaultValues);
            // If don't need confirmation then just submit it
            if (!confirm) {
                onSubmit(data);
                return;
            }
            // If need confirmation, check if there are any changes. If yes, submit data else reset the data
            if (isChanged) {
                if (window.confirm('Are you sure you want to submit?')) {
                    onSubmit(data);
                } else {
                    onSubmit() // onSubmit with no argument to run remain code 
                    formMethods.reset(defaultValues);
                }
            } else onSubmit()
        },
        [confirm, defaultValues, formMethods, onSubmit],
    );

    return (
        <FormProvider {...formMethods}>
            <form className={`form ${className}`} onSubmit={formMethods.handleSubmit(handleSubmit)} ref={ref} {...props}>
                {children}
            </form>
        </FormProvider>
    );
}

export default memo(forwardRef(Form));
