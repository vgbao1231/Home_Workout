import SlidesTable from './SlidesTable/SlidesTable';
import './ManageSlidesPage.scss'

export default function ManageSlidesPage() {
    return (
        <div className="manage-slides-page">
            <h1>Manage Slides</h1>
            <SlidesTable />
        </div>
    );
};
