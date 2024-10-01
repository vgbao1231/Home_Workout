import { forwardRef, memo } from 'react';
import './Form.scss';
import { FormProvider, useForm } from 'react-hook-form';

function Form({ children, className = '', defaultValues = {}, onSubmit, confirm, ...props }, ref) {
    // console.log('form');
    const methods = useForm({
        defaultValues, // Default values for all fields
    });

    const handleSubmit = (data) => {
        const isChanged = JSON.stringify(data) !== JSON.stringify(defaultValues);

        if (!confirm) {
            onSubmit(data);
            return;
        }
        if (isChanged) {
            if (window.confirm('Bạn có chắc chắn muốn submit không?')) {
                onSubmit(data);
            } else {
                methods.reset(defaultValues);
            }
        }
        onSubmit();
    };

    return (
        <FormProvider {...methods}>
            <form className={`form ${className}`} onSubmit={methods.handleSubmit(handleSubmit)} ref={ref} {...props}>
                {children}
            </form>
        </FormProvider>
    );
}

export default memo(forwardRef(Form));
