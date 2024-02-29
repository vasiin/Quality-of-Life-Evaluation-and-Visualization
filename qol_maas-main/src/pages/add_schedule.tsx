import { useEffect, useState } from "react";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import DateTimePicker from "../components/DateTimePicker";
import TopComponent from "~/components/TopComponent";
import dynamic from "next/dynamic";
import eventState from "../global_state/event";
import { useRouter } from "next/navigation";

const MapComponent = dynamic(() => import("../components/MapComponent"), {
  ssr: false,
});

import { ChevronLeftIcon } from "@heroicons/react/solid";
import Link from "next/link";

// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const localizer = momentLocalizer(moment); // or globalizeLocalizer

export default function Example() {
  const { push } = useRouter();
  const [events, setEvents] = useState([]);
  const { eventObject, addEventObject, deleteEventObject } = eventState();
  const initialFormData = {
    title: "",
    duration: "",
    starting_time: "",
    travel_mode: "driving",
    flexible: false,
    location: {},
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    setEvents(
      Object.keys(eventObject).map((key) => {
        const e = eventObject[key];
        return {
          title: key,
          start:
            typeof e.start === "string" || e.start instanceof String
              ? new Date(e.start)
              : e.start,
          end:
            typeof e.end === "string" || e.end instanceof String
              ? new Date(e.end)
              : e.end,
        };
      })
    );
  }, [eventObject]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let updateValue =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const { name } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: updateValue,
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Perform form submission or data processing logic
    const { title, duration, starting_time, travel_mode, flexible, location } =
      formData;
    if (title !== "") {
      const [dHours, dMinutes] = duration.split(":");
      const [sHours, sMinutes] = starting_time.split(":");
      const startTime = new Date(
        `${new Date().toLocaleDateString()} ${starting_time}`
      );
      const endTime = new Date(
        `${new Date().toLocaleDateString()} ${(
          parseInt(sHours, 10) + parseInt(dHours, 10)
        )
          .toString()
          .padStart(2, "0")}:${(parseInt(sMinutes, 10) + parseInt(dMinutes, 10))
          .toString()
          .padStart(2, "0")}`
      );
      addEventObject(title, {
        start: startTime,
        end: endTime,
        travel_mode,
        flexible,
        location,
      });
      if (Object.keys(eventObject).length > 0) {
        push("/plan_select");
      } else {
        push("/add_schedule");
      }
    }
  };
  const loadEvent = (selectedEvent) => {
    setFormData({
      title: selectedEvent.title,
      location: eventObject[selectedEvent.title].location,
      duration: `${(
        selectedEvent.end.getHours() - selectedEvent.start.getHours()
      )
        .toString()
        .padStart(2, "0")}:${(
        selectedEvent.end.getMinutes() - selectedEvent.start.getMinutes()
      )
        .toString()
        .padStart(2, "0")}`,
      starting_time: `${selectedEvent.start
        .getHours()
        .toString()
        .padStart(2, "0")}:${selectedEvent.start
        .getMinutes()
        .toString()
        .padStart(2, "0")}`,
      travel_mode: eventObject[selectedEvent.title].travel_mode,
      flexible: eventObject[selectedEvent.title].flexible,
    });
  };
  return (
    <>
      <div className="flex h-full">
        <TopComponent>
          <main className="flex flex-1 overflow-hidden">
            <div className="flex flex-1 flex-col overflow-y-auto xl:overflow-hidden">
              {/* Breadcrumb */}
              <nav
                aria-label="Breadcrumb"
                className="border-b border-blue-gray-200 bg-white xl:hidden"
              >
                <div className="mx-auto flex max-w-3xl items-start px-4 py-3 sm:px-6 lg:px-8">
                  <a
                    href="/schedule"
                    className="-ml-1 inline-flex items-center space-x-3 text-sm font-medium text-blue-gray-900"
                  >
                    <ChevronLeftIcon
                      className="h-5 w-5 text-blue-gray-400"
                      aria-hidden="true"
                    />
                    <span>Schedule</span>
                  </a>
                </div>
              </nav>

              <div className="flex flex-1 xl:overflow-hidden">
                {/* Secondary sidebar */}
                <nav
                  aria-label="Sections"
                  className="hidden w-96 flex-shrink-0 border-r border-blue-gray-200 bg-white xl:flex xl:flex-col"
                >
                  <div className="flex h-16 flex-shrink-0 items-center border-b border-blue-gray-200 px-6">
                    <p className="text-lg font-medium text-blue-gray-900">
                      Settings
                    </p>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto">
                    <Calendar
                      localizer={localizer}
                      events={events}
                      startAccessor="start"
                      endAccessor="end"
                      views={["day"]}
                      defaultView={"day"}
                      toolbar={false}
                      onSelectEvent={loadEvent}
                    />
                  </div>
                </nav>

                {/* Main content */}
                <div className="flex-1 xl:overflow-y-auto">
                  <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                    <h1 className="text-3xl font-extrabold text-blue-gray-900">
                      Schedule Management
                    </h1>

                    <div className="divide-y-blue-gray-200 mt-6 space-y-8 divide-y">
                      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                        <div className="sm:col-span-6">
                          <h2 className="text-xl font-medium text-blue-gray-900">
                            Add Schedule
                          </h2>
                          <p className="mt-1 text-sm text-blue-gray-500">
                            This information will be displayed publicly so be
                            careful what you share.
                          </p>
                        </div>

                        <div className="sm:col-span-6">
                          <label
                            htmlFor="first-name"
                            className="block text-sm font-medium text-blue-gray-900"
                          >
                            Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            autoComplete="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-blue-gray-300 text-blue-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 lg:text-lg"
                          />
                        </div>
                        <div className="sm:col-span-6">
                          <label
                            htmlFor="first-name"
                            className="block text-sm font-medium text-blue-gray-900"
                          >
                            Selected Location
                          </label>
                          <input
                            type="text"
                            value={formData.location?.name ?? ""}
                            readOnly
                            className="mt-1 block w-full rounded-md border-blue-gray-300 text-blue-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 lg:text-lg"
                          />
                        </div>
                        <div className="sm:col-span-6">
                          <MapComponent onSelect={handleInputChange} />
                        </div>
                        <div className="sm:col-span-6">
                          <label
                            htmlFor="starting_time"
                            className="block text-sm font-medium text-blue-gray-900"
                          >
                            Starting Time
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <DateTimePicker
                              value={formData.starting_time}
                              onChange={handleInputChange}
                              name="starting_time"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <label
                            htmlFor="duration"
                            className="block text-sm font-medium text-blue-gray-900"
                          >
                            Duration
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <DateTimePicker
                              value={formData.duration}
                              name="duration"
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                      {/* <div className="travel-mode">
                        <div className="mb-4">
                          <label
                            htmlFor="mode"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Travel Mode
                          </label>
                          <select
                            id="travel_mode"
                            name="travel_mode"
                            value={formData.travel_mode}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value="driving">Driving</option>
                            <option value="walking">Walking</option>
                            <option value="transit">Transit</option>
                          </select>
                        </div>
                      </div> */}
                      {/* {formData.travel_mode==='driving' && <div>
                        <div className="relative flex items-start py-4">
                          <label className="block text-sm font-medium text-gray-700">
                            Avoid
                          </label>
                        </div>
                        <div className="relative flex items-start">
                          <div className="min-w-0 flex-1 text-sm">
                            <label
                              htmlFor="avoid-highways"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Highways
                            </label>
                          </div>
                          <div className="ml-3 flex h-5 items-center">
                            <input
                              type="checkbox"
                              id="avoid-highways"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                        <div className="relative flex items-start py-4">
                          <div className="min-w-0 flex-1 text-sm">
                            <label
                              htmlFor="avoid-tolls"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Tolls
                            </label>
                          </div>
                          <div className="ml-3 flex h-5 items-center">
                            <input
                              type="checkbox"
                              id="avoid-tolls"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                        <div className="relative flex items-start">
                          <div className="min-w-0 flex-1 text-sm">
                            <label
                              htmlFor="avoid-ferries"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Ferries
                            </label>
                          </div>
                          <div className="ml-3 flex h-5 items-center">
                            <input
                              type="checkbox"
                              id="avoid-ferries"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      </div>}
                      {formData.travel_mode==='transit' && <div>
                        <div className="relative flex items-start py-4">
                          <label className="block text-sm font-medium text-gray-700">
                            Prefer
                          </label>
                        </div>
                        <div className="relative flex items-start">
                          <div className="min-w-0 flex-1 text-sm">
                            <label
                              htmlFor="prefer-bus"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Bus
                            </label>
                          </div>
                          <div className="ml-3 flex h-5 items-center">
                            <input
                              type="checkbox"
                              id="prefer-bus"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                        <div className="relative flex items-start py-4">
                          <div className="min-w-0 flex-1 text-sm">
                            <label
                              htmlFor="prefer-subway"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Subway
                            </label>
                          </div>
                          <div className="ml-3 flex h-5 items-center">
                            <input
                              type="checkbox"
                              id="prefer-subway"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                        <div className="relative flex items-start">
                          <div className="min-w-0 flex-1 text-sm">
                            <label
                              htmlFor="prefer-train"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Train
                            </label>
                          </div>
                          <div className="ml-3 flex h-5 items-center">
                            <input
                              type="checkbox"
                              id="prefer-train"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                        <div className="relative flex items-start py-4">
                          <div className="min-w-0 flex-1 text-sm">
                            <label
                              htmlFor="prefer-tram"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Tram and light rail
                            </label>
                          </div>
                          <div className="ml-3 flex h-5 items-center">
                            <input
                              type="checkbox"
                              id="prefer-tram"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      </div>} */}
                      <div className="relative flex items-start py-4">
                        <div className="min-w-0 flex-1 text-sm">
                          <label
                            htmlFor="flexible"
                            className="font-medium text-gray-700"
                          >
                            Flexible
                          </label>
                          <p
                            id="flexible-description"
                            className="text-gray-500"
                          >
                            Starting time can be rearranged if needed
                          </p>
                        </div>
                        <div className="ml-3 flex h-5 items-center">
                          <input
                            id="flexible"
                            aria-describedby="flexible-description"
                            name="flexible"
                            type="checkbox"
                            checked={formData.flexible}
                            onChange={handleInputChange}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-8">
                        {formData.title !== "" &&
                          formData.title in eventObject && (
                            <button
                              type="button"
                              // disabled={
                              //   !(
                              //     formData.title !== "" &&
                              //     formData.title in eventObject
                              //   )
                              // }
                              onClick={() => {
                                deleteEventObject(formData.title);
                                setFormData(initialFormData);
                              }}
                              className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                              Delete
                            </button>
                          )}
                        <Link
                          type="button"
                          href="/"
                          className="ml-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-blue-gray-900 shadow-sm hover:bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Cancel
                        </Link>
                        <button
                          onClick={handleSubmit}
                          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </TopComponent>
      </div>
    </>
  );
}
