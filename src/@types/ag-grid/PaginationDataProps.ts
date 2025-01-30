type PaginationDataProps = {
    pageSize : number,
    currentPage : number,
    totalPages : number
    selectedPageSize: (size:number) =>void,
    handlePageChange : (page : number) => void,
  }

  export default PaginationDataProps;