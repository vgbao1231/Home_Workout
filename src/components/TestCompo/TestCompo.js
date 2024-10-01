// import { forwardRef, memo } from 'react';

// function TestCompo(props, ref) {
//     console.log(props);
//     console.log(ref);

//     return <input type="file" ref={ref} {...props} />;
// }
// export default memo(forwardRef(TestCompo));

import { forwardRef, memo, useImperativeHandle, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

function TestCompo({ name, ...props }, ref) {
    console.log('test render');
    const { register } = useFormContext();
    const tempRef = useRef();
    useImperativeHandle(ref, () => tempRef.current);

    return <input ref={tempRef} {...register(name)} placeholder="" {...props} />;
}
export default memo(forwardRef(TestCompo));
