import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.scss';

function Pagination({ currentPage, setCurrentPage, totalPages }) {
    let pagesArray = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pagesArray.push(i);
        }
    } else {
        if (currentPage <= 4) {
            for (let i = 1; i <= currentPage + 2; i++) {
                pagesArray.push(i);
            }
            pagesArray.push('...');
            pagesArray.push(totalPages);
        } else if (currentPage > totalPages - 4) {
            pagesArray = [1, '...'];
            for (let i = currentPage - 2; i <= totalPages; i++) {
                pagesArray.push(i);
            }
        } else {
            pagesArray = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
        }
    }

    return (
        <div className="pagination center">
            <button
                className="page-button center"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
            >
                <ChevronLeft />
            </button>
            {pagesArray.map((page, index) => {
                return page !== '...' ? (
                    <button
                        className={`page-button center${page === currentPage ? ' active' : ''}`}
                        key={index}
                        onClick={() => setCurrentPage(page)}
                    >
                        {page}
                    </button>
                ) : (
                    <span key={index}>...</span>
                );
            })}
            <button
                className="page-button center"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
            >
                <ChevronRight />
            </button>
        </div>
    );
}

export default Pagination;
