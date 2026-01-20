type PaginationDataWithoutCountProps = {
    pageSize : number,
    currentPage : number,
    hasNextPage : boolean;
    onPageSizeChange: (size : number) =>void,
    handlePageChange : (page : number) => void,
  }

  export default PaginationDataWithoutCountProps;