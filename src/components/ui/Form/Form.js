import { forwardRef, memo, useCallback } from 'react';
import './Form.scss';
import { FormProvider, useForm } from 'react-hook-form';

function Form({ children, className = '', defaultValues = {}, onSubmit, confirm, ...props }, ref) {
    // console.log('form');
    const methods = useForm({
        defaultValues, // Default values for all fields
        mode: 'all', // Validate on change,blur and submit
    });

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
                if (window.confirm('Bạn có chắc chắn muốn submit không?')) {
                    onSubmit(data);
                } else {
                    methods.reset(defaultValues);
                }
            }
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
