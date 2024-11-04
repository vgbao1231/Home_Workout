import { useState } from 'react';
import './Tabs.scss';

function Tabs({ tabs }) {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (index) => {
        setActiveTab(index);
    };
    return (
        <div className="tabs-wrapper">
            <div className="tabs-header">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => handleTabChange(index)}
                        className={`tab-button ${activeTab === index ? 'active' : ''}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="tabs-content">{tabs[activeTab].content}</div>
        </div>
    );
}

export default Tabs;
