import SlidesTable from './SlidesTable/SlidesTable';
import './ManageSlidesPage.scss'

export default function ManageSlidesPage() {
    return (
        <div className="manage-slides-page">
            <span className='title center'>Manage Slides</span>
            <SlidesTable />
        </div>
    );
};
