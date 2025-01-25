type PaginationProps =  {
    totalPages: number;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}
export default PaginationProps;