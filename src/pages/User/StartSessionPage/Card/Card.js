import './Card.scss'

function Card({ className, title, children }) {
    return (
        <div className={`card flex-col ${className}`}>
            <div className="card-title">{title}</div>
            <div className="card-body">
                {children}
            </div>
        </div>
    );
}

export default Card;