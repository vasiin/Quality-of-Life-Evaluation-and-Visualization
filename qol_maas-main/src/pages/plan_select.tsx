import { useCallback, useEffect, useState } from "react";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import TopComponent from "~/components/TopComponent";
import eventState from "../global_state/event";
import mapViewState from "../global_state/mapview";
// import travelTimeData from "../temp_data/travel_time.json";
import dynamic from "next/dynamic";
// import trip_path from "~/temp_data/direction_pt4.json";
// import trip_path_2 from "~/temp_data/direction2.json";
// import trip_path_3 from "~/temp_data/direction3.json";
import { LoadingPage } from "~/components/loading";
const Map = dynamic(() => import("~/components/Map"), { ssr: false });

import {
  ChevronLeftIcon,
  CalendarIcon,
  LocationMarkerIcon,
  UsersIcon,
} from "@heroicons/react/solid";

import Link from "next/link";
import Leg from "~/components/Leg";

// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const localizer = momentLocalizer(moment); // or globalizeLocalizer

function convertSecondsToTime(seconds) {
  const hours = Math.floor(seconds / 3600); // 1 hour = 3600 seconds
  const minutes = Math.floor((seconds % 3600) / 60); // 1 minute = 60 seconds

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}

export default function Example() {
  const [events, setEvents] = useState([]);
  const { eventObject, eventList } = eventState();
  const { setViewState } = mapViewState();

  console.log(eventObject, eventList);
  // console.log(eventObject, eventList, "hihi");
  // useEffect(() => {
  //   const newEvents = Object.keys(eventObject).map((key) => {
  //     const e = eventObject[key];
  //     const startTime =
  //       typeof e.start === "string" || e.start instanceof String
  //         ? new Date(e.start)
  //         : e.start;
  //     const endTime =
  //       typeof e.end === "string" || e.end instanceof String
  //         ? new Date(e.end)
  //         : e.end;
  //     return [
  //       ...travelTimeData.rows.map((v) => {
  //         const initialTime =
  //           startTime.getHours() * 3600 +
  //           startTime.getMinutes() * 60 +
  //           startTime.getSeconds() -
  //           v.elements[0].duration.value;
  //         return {
  //           title: `${key} (Departure)`,
  //           start: new Date(
  //             `${new Date().toLocaleDateString()} ${convertSecondsToTime(
  //               initialTime
  //             )}`
  //           ),
  //           end: startTime,
  //         };
  //       }),
  //       {
  //         title: key,
  //         start: startTime,
  //         end: endTime,
  //       },
  //     ];
  //   });
  //   setEvents(newEvents.flat());
  // }, [eventObject]);

  // const eventStyleGetter = useCallback((event) => {
  //   var backgroundColor = /[()]/.test(event.title) ? "#A6E3E9" : "#71C9CE";
  //   var style = {
  //     backgroundColor: backgroundColor,
  //     borderRadius: "0px",
  //     color: "black",
  //     border: "0px",
  //   };
  //   return {
  //     style: style,
  //   };
  // });

  // console.log(trip_path, trip_path_2, trip_path_3);
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
                    href="#"
                    className="-ml-1 inline-flex items-center space-x-3 text-sm font-medium text-blue-gray-900"
                  >
                    <ChevronLeftIcon
                      className="h-5 w-5 text-blue-gray-400"
                      aria-hidden="true"
                    />
                    <span>Home</span>
                  </a>
                </div>
              </nav>

              <div className="flex flex-1 xl:overflow-hidden">
                {/* Main content */}
                <div className="hidden flex-1 md:flex xl:overflow-hidden">
                  <Map />
                </div>
                <div className="flex-1 xl:overflow-y-auto">
                  <div className="mx-auto max-w-3xl sm:px-6 lg:px-8 lg:py-4">
                    <div className="bg-white shadow sm:rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <h1 className="text-3xl font-extrabold text-blue-gray-900">
                          Route Choices
                        </h1>
                        <div className="overflow-hidden bg-white shadow sm:rounded-md">
                          <ul role="list" className="divide-y divide-gray-200">
                            {/* {trip_path.routes.map((route) => (
                              <Leg route={route.legs[0]} />
                            ))} */}
                          </ul>
                        </div>
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
