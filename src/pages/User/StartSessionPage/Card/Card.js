import { CircleCheckBig } from 'lucide-react';
import './Card.scss'

function Card({ className, title, children, isCompleted }) {
    return (
        <div className={`card flex-col ${className}`}>
            <div className="card-title">
                <span>{title}</span>
                {isCompleted && <CircleCheckBig />}
            </div>
            <div className="card-body">
                {children}
            </div>
        </div>
    );
}

export default Card;