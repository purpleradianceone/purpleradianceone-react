// import React, { createContext, ReactNode } from "react";
// import LOCALSTORAGE_KEYS from "../../constants/LocalStorage";

// interface MasterRowsInGrid{
//     id: number;
//     rowsInGrid : number;
// }


// type MasterRowsInGridProps= {
//     rowsInGrid : MasterRowsInGrid[]
//     setRowsInGrid : (rowsInGrid : MasterRowsInGrid) => void;
// }

// const MasterRowsInGridContext = createContext<MasterRowsInGridProps | undefined>(undefined);

// export const MasterRowsInGridProvider : React.FC<{children : ReactNode}>=({children}) => {
//     const [masterRownInGrid , setMasterRownInGrid ]= React.useState<MasterRowsInGrid[]>(()=>{
//           const savedMasterRowsInGrid = localStorage.getItem(LOCALSTORAGE_KEYS.MASTER_ROWS_IN_GRID);
//         return savedMasterRowsInGrid ? JSON.parse(savedMasterRowsInGrid) : []
//     });
// }

