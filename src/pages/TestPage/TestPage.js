// import ShowAllSelected from '~/components/ui/Dialog/DialogContent/ShowAllSelected';
// import './TestPage.scss'; // Giữ lại để đảm bảo styles được áp dụng
// import { Dialog, Form, Input, MultiSelect, Select } from '~/components';
// import { useState } from 'react';
// import ShowImage from '~/components/ui/Dialog/DialogContent/ShowImage/ShowImage';
// import { isAlphabetic, isEmail, isRequired } from '~/utils/validators';
// import { capitalizeWords, formatCurrency, trimWords } from '~/utils/formatters';
// import { useMultistepForm } from '~/hooks/useMultiStepForm';
// import { Upload } from 'lucide-react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import springService, { fastApiService } from '~/services/apiService';
// const options = [
//     { raw: '1', value: '1', text: 'Male' },
//     { raw: '0', value: '0', text: 'Female' },
// ];

// function TestPage() {
// const [step, setStep] = useState(0);
// const {} = useMultistepForm([]);
// const handleNext = () => {
//     setStep((prev) => prev + 1);
// };
// const handleBack = () => {
//     setStep((prev) => prev - 1);
// };

// const handleSubmit = (formData) => {
//     console.log(formData);
// };

// return (
//     <Form
//         onSubmit={(data) => {
//             console.log(data);
//             const file = document.querySelector('input');

//             const formData = new FormData();
//             if (file) {
//                 // const file = data.img; // Get first file in FileList
//                 formData.append('image', file.files[0]); // Append file
//                 formData.append('gender', data.gender); // Append file
//                 console.log(formData);
//             }

//             fastApiService.post('/api/private/user/v1/cal-body-fat-detection', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//         }}
//     >
//         <Input id="image-upload" name="image" type="file" validators={{ isRequired }} />
//         <Input name="gender" label="Gender" validators={{ isRequired }} />
//         {/* <Select id="gender" name="gender" label="Gender" options={options} /> */}
//         <button>Upload</button>
//     </Form>
// );

// return (
//     <Form
//         onSubmit={handleSubmit}
//         defaultValues={{
//             multi: ['0', '1'],
//             select: '0',
//             email: 'vgb@gmail.com',
//         }}
//         confirm
//     >
//         <Input
//             name="email"
//             label="Email"
//             validators={{ isRequired, isAlphabetic }}
//             formatters={{
//                 onChange: [capitalizeWords],
//                 onBlur: [trimWords],
//             }}
//             onChange={() => console.log('change')}
//             onFocus={() => console.log('focus')}
//         />
//         <Select name="select" label="Select" options={options} validators={{ isRequired }} />
//         <MultiSelect name="multi" label="Multi-Select" options={options} validators={{ isRequired }} />
//         <button>Next</button>
//     </Form>
// );

// return (
//     <div>
//         {/* <button onClick={() => setDialogProps({ isOpen: true, title: 'Exercise Image', body: <ShowImage /> })}>
//         Open Add Dialog
//     </button>
//     <button onClick={() => setDialogProps({ isOpen: true, title: 'Update Item', body: <ShowAllSelected /> })}>
//         Open Update Dialog
//     </button> */}

//         {/* <Dialog onClose={handleClose} {...dialogProps} /> */}
//         <Form onSubmit={handleSubmit}>
//             {step === 0 && (
//                 <Input
//                     name="username"
//                     label="Username"
//                     validators={{ isRequired }}
//                     formatters={{
//                         onChange: [capitalizeWords],
//                         onBlur: [trimWords],
//                     }}
//                 />
//             )}
//             {step === 1 && <Select name="select" label="Select" options={options} validators={{ isRequired }} />}
//             {step === 2 && (
//                 <MultiSelect
//                     name="multi-select"
//                     label="Multi-Select"
//                     options={options}
//                     validators={{ isRequired }}
//                 />
//             )}

//             <button type="button" onClick={handleBack}>
//                 Back
//             </button>
//             <button>Next</button>
//         </Form>
//     </div>
// );
// }

// export default TestPage;
