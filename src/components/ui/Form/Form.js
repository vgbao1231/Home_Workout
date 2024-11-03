import { forwardRef, memo, useCallback, useEffect } from 'react';
import './Form.scss';
import { FormProvider, useForm } from 'react-hook-form';

function Form({ children, className = '', defaultValues, onSubmit, confirm, ...props }, ref) {
    const methods = useForm({
        defaultValues: defaultValues || {}, // Default values for all fields
        mode: 'all', // Validate on change,blur and submit
    });
    console.log(defaultValues);


    // Reset form when there is new default data
    useEffect(() => {
        !Array.isArray(defaultValues) && methods.reset(defaultValues); // Reset form with new default data
    }, [defaultValues, methods]);

    const handleSubmit = useCallback(
        (data) => {
            console.log(data);
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
                    methods.reset(defaultValues);
                }
            } else onSubmit()
        },
        [confirm, defaultValues, methods, onSubmit],
    );

    return (
        <FormProvider {...methods}>
            <form className={`form ${className}`} onSubmit={methods.handleSubmit(handleSubmit)} ref={ref} {...props}>
                {children}
            </form>
        </FormProvider>
    );
}

export default memo(forwardRef(Form));
