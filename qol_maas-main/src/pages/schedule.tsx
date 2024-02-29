import { useCallback, useEffect, useState, useMemo } from "react";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import TopComponent from "~/components/TopComponent";
import TimeLine from "~/components/TimeLine";
import eventState from "../global_state/event";
import mapViewState from "../global_state/mapview";
import travelTimeData from "../temp_data/travel_time.json";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("~/components/Map"), { ssr: false });

import {
  CheckIcon,
  ChevronLeftIcon,
  CogIcon,
  MailIcon,
  PhoneIcon,
  PlusIcon,
  SelectorIcon,
} from "@heroicons/react/solid";
import Link from "next/link";

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

              <div className="flex flex-1 flex-col items-center">
                {/* Main content */}
                <Map />
                <div className="fixed mt-5 w-11/12 border-b border-gray-200 bg-white shadow-lg sm:rounded-xl">
                  <div className="px-7 pb-6 pt-2">
                    <div>
                      <div>
                        <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between pb-4 sm:flex-nowrap">
                          <div className="ml-4 mt-2">
                            <h1 className="text-3xl font-extrabold text-blue-gray-900">
                              Schedule
                            </h1>
                          </div>
                          <div className="ml-4 mt-4 flex flex-shrink-0">
                            <Link
                              href="/add_schedule"
                              className="relative ml-3 inline-flex items-center rounded-md bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                              <PlusIcon
                                className="-ml-1 mr-2 h-5 w-5 text-indigo-700"
                                aria-hidden="true"
                              />
                              <span>Add</span>
                            </Link>
                            <button
                              type="button"
                              className="relative ml-3 inline-flex items-center rounded-md bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              onClick={() => {
                                alert("optimize");
                              }}
                            >
                              <CogIcon
                                className="-ml-1 mr-2 h-5 w-5 text-indigo-700"
                                aria-hidden="true"
                              />
                              <span>Optimize</span>
                            </button>
                          </div>
                        </div>
                        <TimeLine />
                        {/* <div className="flex justify-center">
                          <Link
                            href="/add_schedule"
                            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Add Schedule
                          </Link>
                          <button
                            onClick={() => {
                              alert("optimize");
                            }}
                            className="ml-4 flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Optimize Schedule
                          </button>
                        </div> */}
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
