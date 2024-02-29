import React, { useEffect, useRef } from "react";
import "tailwindcss/tailwind.css";
import "flatpickr/dist/flatpickr.css";
import flatpickr from "flatpickr";

const DateTimePicker: React.FC = ({ value, onChange, name }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const valueList = value.split(":");
  useEffect(() => {
    if (inputRef.current) {
      flatpickr(inputRef.current, {
        enableTime: true,
        dateFormat: "H:i",
        minuteIncrement: 30,
        time_24hr: true,
        noCalendar: true,
        onChange: function (_, dateStr) {
          onChange({ target: { value: dateStr, name, type: "text" } });
        },
        defaultHour:
          value !== ""
            ? valueList.length > 0
              ? parseInt(valueList[0], 10)
              : 12
            : 12,
        defaultMinute:
          value !== ""
            ? valueList.length > 0
              ? parseInt(valueList[1], 10)
              : 0
            : 0,
      });
    }
  }, [value]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        name={name}
        defaultValue={value}
        className="text-blue-gray-900focus:border-transparent w-full rounded  border border-blue-gray-300 bg-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Select Time"
      />
    </div>
  );
};

export default DateTimePicker;
