// import React, { useEffect, useState } from "react";
// import axios from "axios";

// interface RoutineViewerProps {
//   routine: {
//     [key: string]: {
//       classTest?: { subject: string; teacher: string; room: string };
//       morningSlots: { subject: string; teacher: string; room: string }[];
//       midDaySlots: {
//         isLab: boolean;
//         subject: string;
//         teacher: string;
//         room: string;
//       }[];
//       afternoonSlots: {
//         isLab: boolean;
//         subject: string;
//         teacher: string;
//         room: string;
//       }[];
//     };
//   };
// }

// export const RoutineViewer: React.FC<RoutineViewerProps> = ({ routine }) => {
//   const [fetchedRoutine, setFetchedRoutine] = useState({});

//   useEffect(() => {
//     const fetchRoutine = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/routine");
//         setFetchedRoutine(response.data);
//       } catch (error) {
//         console.error("Failed to fetch routine:", error);
//       }
//     };
//     fetchRoutine();
//   }, []);

//   const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
//   const timeSlots = [
//     { time: "8:30 - 9:00", type: "classTest" },
//     { time: "9:00 - 9:50", type: "morning", index: 0 },
//     { time: "9:50 - 10:40", type: "morning", index: 1 },
//     { time: "11:00 - 11:50", type: "midDay", index: 0 },
//     { time: "11:50 - 12:40", type: "midDay", index: 1 },
//     { time: "12:40 - 1:30", type: "midDay", index: 2 },
//     { time: "2:30 - 3:20", type: "afternoon", index: 0 },
//     { time: "3:20 - 4:10", type: "afternoon", index: 1 },
//     { time: "4:10 - 5:00", type: "afternoon", index: 2 },
//   ];

//   const getSlotContent = (day: string, slot: (typeof timeSlots)[0]) => {
//     const dayRoutine: { [key: string]: any } =
//       fetchedRoutine[day as keyof typeof fetchedRoutine] || {};

//     if (slot.type === "classTest") {
//       return { content: dayRoutine.classTest || "No Class", colSpan: 1 };
//     } else if (slot.type === "morning") {
//       return {
//         content: dayRoutine.morningSlots?.[slot.index!] || "No Class",
//         colSpan: 1,
//       };
//     } else if (slot.type === "midDay") {
//       const slotContent = dayRoutine.midDaySlots?.[slot.index!];
//       if (slotContent?.isLab) {
//         return { content: slotContent, colSpan: 3 };
//       }
//       return { content: slotContent || "No Class", colSpan: 1 };
//     } else if (slot.type === "afternoon") {
//       const slotContent = dayRoutine.afternoonSlots?.[slot.index!];
//       if (slotContent?.isLab) {
//         return { content: slotContent, colSpan: 3 };
//       }
//       return { content: slotContent || "No Class", colSpan: 1 };
//     }
//     return { content: "No Class", colSpan: 1 };
//   };

//   const renderClassInfo = (classInfo: {
//     subject: string;
//     teacher: string;
//     room: string;
//     isLab?: boolean;
//   }) => {
//     if (
//       !classInfo ||
//       !classInfo.subject ||
//       !classInfo.teacher ||
//       !classInfo.room
//     ) {
//       return <div className="text-xs text-gray-400">No Class</div>;
//     }

//     return (
//       <div className="text-xs text-gray-900">
//         <div>
//           <strong>Subject:</strong> {classInfo.subject}
//         </div>
//         <div>
//           <strong>Teacher:</strong> {classInfo.teacher}
//         </div>
//         <div>
//           <strong>Room:</strong> {classInfo.room}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full border border-gray-300 text-xs">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border border-gray-300 px-2 py-1 text-left font-medium">
//               Day
//             </th>
//             {timeSlots.map((slot, index) => (
//               <th
//                 key={index}
//                 className="border border-gray-300 px-2 py-1 font-medium"
//               >
//                 {slot.time}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {days.map((day) => {
//             let skipCount = 0; // To handle lab session spanning multiple columns
//             return (
//               <tr key={day} className="border-t border-gray-300">
//                 <td className="border border-gray-300 px-2 py-1 font-medium bg-gray-50">
//                   {day}
//                 </td>
//                 {timeSlots.map((slot, index) => {
//                   if (skipCount > 0) {
//                     skipCount--;
//                     return null;
//                   }

//                   const { content, colSpan } = getSlotContent(day, slot);
//                   if (colSpan > 1) {
//                     skipCount = colSpan - 1;
//                   }

//                   return (
//                     <td
//                       key={index}
//                       colSpan={colSpan}
//                       className="border border-gray-300 px-2 py-1 text-center"
//                     >
//                       {typeof content === "string" ? (
//                         <div className="text-xs text-gray-400">{content}</div> // Handles "No Class" as a string
//                       ) : (
//                         <div>{renderClassInfo(content)}</div> // Handles valid class info
//                       )}
//                     </td>
//                   );
//                 })}
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };






import React from "react";

interface RoutineViewerProps {
  routine: {
    [key: string]: {
      classTest?: { subject: string; teacher: string; room: string };
      morningSlots: { subject: string; teacher: string; room: string }[];
      midDaySlots: {
        isLab: boolean;
        subject: string;
        teacher: string;
        room: string;
      }[];
      afternoonSlots: {
        isLab: boolean;
        subject: string;
        teacher: string;
        room: string;
      }[];
    };
  };
}

export const RoutineViewer: React.FC<RoutineViewerProps> = ({ routine }) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  const timeSlots = [
    { time: "8:30 - 9:00", type: "classTest" },
    { time: "9:00 - 9:50", type: "morning", index: 0 },
    { time: "9:50 - 10:40", type: "morning", index: 1 },
    { time: "11:00 - 11:50", type: "midDay", index: 0 },
    { time: "11:50 - 12:40", type: "midDay", index: 1 },
    { time: "12:40 - 1:30", type: "midDay", index: 2 },
    { time: "2:30 - 3:20", type: "afternoon", index: 0 },
    { time: "3:20 - 4:10", type: "afternoon", index: 1 },
    { time: "4:10 - 5:00", type: "afternoon", index: 2 },
  ];

  const getSlotContent = (day: string, slot: (typeof timeSlots)[0]) => {
    // Use the routine prop directly instead of local state.
    const dayRoutine: { [key: string]: any } =
      routine[day as keyof typeof routine] || {};

    if (slot.type === "classTest") {
      return { content: dayRoutine.classTest || "No Class", colSpan: 1 };
    } else if (slot.type === "morning") {
      return {
        content: dayRoutine.morningSlots?.[slot.index!] || "No Class",
        colSpan: 1,
      };
    } else if (slot.type === "midDay") {
      const slotContent = dayRoutine.midDaySlots?.[slot.index!];
      if (slotContent?.isLab) {
        return { content: slotContent, colSpan: 3 };
      }
      return { content: slotContent || "No Class", colSpan: 1 };
    } else if (slot.type === "afternoon") {
      const slotContent = dayRoutine.afternoonSlots?.[slot.index!];
      if (slotContent?.isLab) {
        return { content: slotContent, colSpan: 3 };
      }
      return { content: slotContent || "No Class", colSpan: 1 };
    }
    return { content: "No Class", colSpan: 1 };
  };

  const renderClassInfo = (classInfo: {
    subject: string;
    teacher: string;
    room: string;
    isLab?: boolean;
  }) => {
    if (
      !classInfo ||
      !classInfo.subject ||
      !classInfo.teacher ||
      !classInfo.room
    ) {
      return <div className="text-xs text-gray-400">No Class</div>;
    }

    return (
      <div className="text-xs text-gray-900">
        <div>
          <strong>Subject:</strong> {classInfo.subject}
        </div>
        <div>
          <strong>Teacher:</strong> {classInfo.teacher}
        </div>
        <div>
          <strong>Room:</strong> {classInfo.room}
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-xs">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-2 py-1 text-left font-medium">
              Day
            </th>
            {timeSlots.map((slot, index) => (
              <th
                key={index}
                className="border border-gray-300 px-2 py-1 font-medium"
              >
                {slot.time}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day) => {
            let skipCount = 0; // To handle lab sessions spanning multiple columns
            return (
              <tr key={day} className="border-t border-gray-300">
                <td className="border border-gray-300 px-2 py-1 font-medium bg-gray-50">
                  {day}
                </td>
                {timeSlots.map((slot, index) => {
                  if (skipCount > 0) {
                    skipCount--;
                    return null;
                  }

                  const { content, colSpan } = getSlotContent(day, slot);
                  if (colSpan > 1) {
                    skipCount = colSpan - 1;
                  }

                  return (
                    <td
                      key={index}
                      colSpan={colSpan}
                      className="border border-gray-300 px-2 py-1 text-center"
                    >
                      {typeof content === "string" ? (
                        <div className="text-xs text-gray-400">{content}</div>
                      ) : (
                        <div>{renderClassInfo(content)}</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

