import { Form, Select } from '~/components';
import './SchedulePage.scss'


function SchedulePage() {
    const goalOptions = [
        { value: 1, text: 'Weigh Up' },
        { value: 0, text: 'Maintain' },
        { value: -1, text: 'Weigh Down' }
    ]

    return <div className="schedule">
        <Form className="choose-schedule-form flex-col">
            <div className="form-title">Choose schedule</div>
            <div className='center'>
                <div className="goal">
                    <div>Goal</div>
                    <Select options={goalOptions} />
                </div>
                <div className='flex-col'>
                    <div className="gender">
                        <div>Gender</div>
                        <div className="gender-wrapper">
                            <button type='button'>Male</button>
                            <button type='button'>Female</button>
                        </div>
                    </div>
                    <div className='center'>
                        <div className="height"></div>
                        <div className="weight"></div>
                    </div>
                </div>
            </div>
            <div className="intensity">
                {[1, 2, 3, 4, 5].map(level => {
                    return <button key={level} type='button'>{level}</button>
                })}
            </div>
            <div className='center'>
                <div className="weight-aim"></div>
                <div className="level"></div>
            </div>
            <button>Choose</button>
        </Form>
    </div>;

}

export default SchedulePage;