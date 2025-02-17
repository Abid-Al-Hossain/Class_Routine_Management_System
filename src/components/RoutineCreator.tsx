import React, { useEffect, useState } from "react";
import axios from "axios";

interface ClassInput {
  subject: string;
  teacher: string;
  room: string;
}

interface LabInput extends ClassInput {
  startTime: string;
  endTime: string;
}

export const RoutineCreator: React.FC<{
  onSave: (day: string, routine: any) => void;
  selectedDay: string;
  onDayChange: (day: string) => void;
}> = ({ onSave, selectedDay, onDayChange }) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  const [classTest, setClassTest] = useState<ClassInput | null>(null);
  const [morningClasses, setMorningClasses] = useState<(ClassInput | null)[]>([
    null,
    null,
  ]);
  const [midDayLab, setMidDayLab] = useState(false);
  const [midDayClasses, setMidDayClasses] = useState<
    (ClassInput | LabInput | null)[]
  >([null, null, null]);
  const [afternoonLab, setAfternoonLab] = useState(false);
  const [afternoonClasses, setAfternoonClasses] = useState<
    (ClassInput | LabInput | null)[]
  >([null, null, null]);

  // Fetch existing routine data for the selected day
  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/routine");
        const routineData = response.data[selectedDay];

        if (routineData) {
          setClassTest(routineData.classTest || null);
          setMorningClasses(routineData.morningSlots || [null, null]);
          setMidDayLab(routineData.midDaySlots?.[0]?.isLab || false);
          setMidDayClasses(routineData.midDaySlots || [null, null, null]);
          setAfternoonLab(routineData.afternoonSlots?.[0]?.isLab || false);
          setAfternoonClasses(routineData.afternoonSlots || [null, null, null]);
        } else {
          // Reset form if no routine exists for the selected day
          setClassTest(null);
          setMorningClasses([null, null]);
          setMidDayLab(false);
          setMidDayClasses([null, null, null]);
          setAfternoonLab(false);
          setAfternoonClasses([null, null, null]);
        }
      } catch (error) {
        console.error("Failed to fetch routine:", error);
      }
    };

    fetchRoutine();
  }, [selectedDay]);

  const handleSave = async () => {
    const routine = {
      classTest: classTest,
      morningSlots: morningClasses.map(
        (slot) => slot || { subject: "", teacher: "", room: "" }
      ),
      midDaySlots: midDayLab
        ? [
            {
              isLab: true,
              ...midDayClasses[0],
              startTime: "11:00",
              endTime: "13:30",
            },
          ]
        : midDayClasses.map((slot) => ({ isLab: false, ...slot })),
      afternoonSlots: afternoonLab
        ? [
            {
              isLab: true,
              ...afternoonClasses[0],
              startTime: "14:30",
              endTime: "17:00",
            },
          ]
        : afternoonClasses.map((slot) => ({ isLab: false, ...slot })),
    };

    try {
      // Save routine to the backend
      const response = await axios.post("http://localhost:5000/api/routine", {
        day: selectedDay,
        routineData: routine,
      });
      if (response.status === 200) {
        alert("Routine saved successfully!");
        onSave(selectedDay, routine); // Update parent component's state
      }
    } catch (error) {
      console.error("Failed to save routine:", error);
      alert("Failed to save routine. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Select Day
        </label>
        <select
          value={selectedDay}
          onChange={(e) => onDayChange(e.target.value)} // Update selected day without saving
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Class Test (8:30 AM - 9:00 AM)
        </label>
        <div className="mt-1 grid grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Subject"
            value={classTest?.subject || ""}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            onChange={(e) =>
              setClassTest({
                ...(classTest || {}),
                subject: e.target.value,
              } as ClassInput)
            }
          />
          <input
            type="text"
            placeholder="Teacher"
            value={classTest?.teacher || ""}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            onChange={(e) =>
              setClassTest({
                ...(classTest || {}),
                teacher: e.target.value,
              } as ClassInput)
            }
          />
          <input
            type="text"
            placeholder="Room"
            value={classTest?.room || ""}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            onChange={(e) =>
              setClassTest({
                ...(classTest || {}),
                room: e.target.value,
              } as ClassInput)
            }
          />
        </div>
      </div>

      {/* Morning Classes Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Morning Classes (9:00 AM - 10:40 AM)
        </h3>
        {morningClasses.map((slot, index) => (
          <div key={index} className="mt-4 grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Subject"
              value={slot?.subject || ""}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              onChange={(e) => {
                const newClasses = [...morningClasses];
                newClasses[index] = {
                  ...(newClasses[index] || {}),
                  subject: e.target.value,
                } as ClassInput;
                setMorningClasses(newClasses);
              }}
            />
            <input
              type="text"
              placeholder="Teacher"
              value={slot?.teacher || ""}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              onChange={(e) => {
                const newClasses = [...morningClasses];
                newClasses[index] = {
                  ...(newClasses[index] || {}),
                  teacher: e.target.value,
                } as ClassInput;
                setMorningClasses(newClasses);
              }}
            />
            <input
              type="text"
              placeholder="Room"
              value={slot?.room || ""}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              onChange={(e) => {
                const newClasses = [...morningClasses];
                newClasses[index] = {
                  ...(newClasses[index] || {}),
                  room: e.target.value,
                } as ClassInput;
                setMorningClasses(newClasses);
              }}
            />
          </div>
        ))}
      </div>

      {/* Mid-Day Classes Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Mid-Day Classes (11:00 AM - 1:30 PM)
        </h3>
        <div className="mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={midDayLab}
              onChange={(e) => {
                setMidDayLab(e.target.checked);
                setMidDayClasses([null, null, null]);
              }}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <span className="ml-2">Lab Session (2.5 hours)</span>
          </label>
        </div>

        {midDayLab ? (
          <div className="mt-4 grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Subject"
              value={midDayClasses[0]?.subject || ""}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              onChange={(e) => {
                const newClasses = [...midDayClasses];
                newClasses[0] = {
                  ...(newClasses[0] || {}),
                  subject: e.target.value,
                } as LabInput;
                setMidDayClasses(newClasses);
              }}
            />
            <input
              type="text"
              placeholder="Teacher"
              value={midDayClasses[0]?.teacher || ""}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              onChange={(e) => {
                const newClasses = [...midDayClasses];
                newClasses[0] = {
                  ...(newClasses[0] || {}),
                  teacher: e.target.value,
                } as LabInput;
                setMidDayClasses(newClasses);
              }}
            />
            <input
              type="text"
              placeholder="Room"
              value={midDayClasses[0]?.room || ""}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              onChange={(e) => {
                const newClasses = [...midDayClasses];
                newClasses[0] = {
                  ...(newClasses[0] || {}),
                  room: e.target.value,
                } as LabInput;
                setMidDayClasses(newClasses);
              }}
            />
          </div>
        ) : (
          midDayClasses.map((slot, index) => (
            <div key={index} className="mt-4 grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Subject"
                value={slot?.subject || ""}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                onChange={(e) => {
                  const newClasses = [...midDayClasses];
                  newClasses[index] = {
                    ...(newClasses[index] || {}),
                    subject: e.target.value,
                  } as ClassInput;
                  setMidDayClasses(newClasses);
                }}
              />
              <input
                type="text"
                placeholder="Teacher"
                value={slot?.teacher || ""}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                onChange={(e) => {
                  const newClasses = [...midDayClasses];
                  newClasses[index] = {
                    ...(newClasses[index] || {}),
                    teacher: e.target.value,
                  } as ClassInput;
                  setMidDayClasses(newClasses);
                }}
              />
              <input
                type="text"
                placeholder="Room"
                value={slot?.room || ""}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                onChange={(e) => {
                  const newClasses = [...midDayClasses];
                  newClasses[index] = {
                    ...(newClasses[index] || {}),
                    room: e.target.value,
                  } as ClassInput;
                  setMidDayClasses(newClasses);
                }}
              />
            </div>
          ))
        )}
      </div>

      {/* Afternoon Classes Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Afternoon (2:30 PM - 5:00 PM)
        </h3>
        <div className="mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={afternoonLab}
              onChange={(e) => {
                setAfternoonLab(e.target.checked);
                setAfternoonClasses([null, null, null]);
              }}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <span className="ml-2">Lab Session (2.5 hours)</span>
          </label>
        </div>

        {afternoonLab ? (
          <div className="mt-4 grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Subject"
              value={afternoonClasses[0]?.subject || ""}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              onChange={(e) => {
                const newClasses = [...afternoonClasses];
                newClasses[0] = {
                  ...(newClasses[0] || {}),
                  subject: e.target.value,
                } as LabInput;
                setAfternoonClasses(newClasses);
              }}
            />
            <input
              type="text"
              placeholder="Teacher"
              value={afternoonClasses[0]?.teacher || ""}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              onChange={(e) => {
                const newClasses = [...afternoonClasses];
                newClasses[0] = {
                  ...(newClasses[0] || {}),
                  teacher: e.target.value,
                } as LabInput;
                setAfternoonClasses(newClasses);
              }}
            />
            <input
              type="text"
              placeholder="Room"
              value={afternoonClasses[0]?.room || ""}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              onChange={(e) => {
                const newClasses = [...afternoonClasses];
                newClasses[0] = {
                  ...(newClasses[0] || {}),
                  room: e.target.value,
                } as LabInput;
                setAfternoonClasses(newClasses);
              }}
            />
          </div>
        ) : (
          afternoonClasses.map((slot, index) => (
            <div key={index} className="mt-4 grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Subject"
                value={slot?.subject || ""}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                onChange={(e) => {
                  const newClasses = [...afternoonClasses];
                  newClasses[index] = {
                    ...(newClasses[index] || {}),
                    subject: e.target.value,
                  } as ClassInput;
                  setAfternoonClasses(newClasses);
                }}
              />
              <input
                type="text"
                placeholder="Teacher"
                value={slot?.teacher || ""}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                onChange={(e) => {
                  const newClasses = [...afternoonClasses];
                  newClasses[index] = {
                    ...(newClasses[index] || {}),
                    teacher: e.target.value,
                  } as ClassInput;
                  setAfternoonClasses(newClasses);
                }}
              />
              <input
                type="text"
                placeholder="Room"
                value={slot?.room || ""}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                onChange={(e) => {
                  const newClasses = [...afternoonClasses];
                  newClasses[index] = {
                    ...(newClasses[index] || {}),
                    room: e.target.value,
                  } as ClassInput;
                  setAfternoonClasses(newClasses);
                }}
              />
            </div>
          ))
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={handleSave}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save Routine
        </button>
      </div>
    </div>
  );
};
