import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPrevious, onNext }) => {
  return (
    <div className="flex justify-center items-center mt-8 space-x-4">
      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
        className={`btn btn-primary ${currentPage === 1 ? "btn-disabled" : ""}`}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className={`btn btn-primary ${currentPage === totalPages ? "btn-disabled" : ""}`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
