import { memo } from 'react';

function TestCompo(props) {
    console.log('test render');

    return <form {...props}>{props.children}</form>;
}

export default memo(TestCompo, (prevProps, nextProps) => {
    // So sánh props cũ và mới
    return prevProps.item === nextProps.item;
});
