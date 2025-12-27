


// Note : used in the account multiple company product assigning
// calculates the end end as per the given start date 
export const calculateEndDate = (
  startDate: Date | null | undefined,
  count: number,
  intervalId: number
): Date | null => {
  if (!startDate) {
    return null;
  }

  const endDate = new Date(startDate.getTime());

  switch (intervalId) {
    case 1:
      endDate.setFullYear(endDate.getFullYear() + count);
      break;

    case 2:
      endDate.setMonth(endDate.getMonth() + count);
      break;

    case 3:
      endDate.setDate(endDate.getDate() + count);
      break;

    default:
      return null;
  }

  // subtract 1 day
  endDate.setDate(endDate.getDate() - 1);

  return endDate;
};

// export const calculateEndDate = (
//   startDate: Date,
//   count: number,
//   intervalId: number
// ): Date => {
//   const endDate = new Date(startDate.getTime());

//   switch (intervalId) {
//     case 1:
//       endDate.setFullYear(endDate.getFullYear() + count);
//       break;
//     case 2:
//       endDate.setMonth(endDate.getMonth() + count);
//       break;
//     case 3:
//       endDate.setDate(endDate.getDate() + count);
//       break;
//   }

//   endDate.setDate(endDate.getDate() - 1);
//   return endDate;
// };



//  const calculateEndDate = (
//     startDate: string,
//     count: number,
//     intervalId: number
//   ): string => {
//     // SAFELY parse YYYY-MM-DD
//     const parts = startDate.split("-").map(Number);
//     const end = new Date(parts[0], parts[1] - 1, parts[2]);

//     // Add duration
//     switch (intervalId) {
//       case 1: // Year
//         end.setFullYear(end.getFullYear() + count);
//         break;

//       case 2: // Month
//         end.setMonth(end.getMonth() + count);
//         break;

//       case 3: // Day
//         end.setDate(end.getDate() + count);
//         break;
//     }

//     // Subtract ONE day (inclusive range)
//     end.setDate(end.getDate() - 1);

//     // Format manually (NO timezone shift)
//     const yyyy = end.getFullYear();
//     const mm = String(end.getMonth() + 1).padStart(2, "0");
//     const dd = String(end.getDate()).padStart(2, "0");

//     console.log("this is the date:");
//     // alert()
//     console.log(`${yyyy}-${mm}-${dd}`);

//     return `${yyyy}-${mm}-${dd}`;
//   };