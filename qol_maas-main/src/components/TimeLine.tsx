import Timeline from "react-vis-timeline";
import eventState from "../global_state/event";
import { useEffect, useState, memo, useRef } from "react";
import moment from "moment";
// https://visjs.github.io/vis-timeline/docs/timeline/#Configuration_Options

const today = new Date();
today.setHours(0, 0, 0, 0);
const tomorrow = new Date(today);
tomorrow.setHours(24, 0, 0, 0);
// tomorrow.setDate(tomorrow.getDate() + 1);
const options = {
  width: "100%",
  height: "100%",
  autoResize: true,
  editable: false,
  //   stack: true, // false == overlap items
  //   orientation: "top",
  //   verticalScroll: true,
  //   editable: {
  //     add: true, // add new items by double tapping
  //     updateTime: true, // drag items horizontally
  //     updateGroup: true, // drag items from one group to another
  //     remove: true, // delete an item by tapping the delete button top right
  //     overrideItems: false, // allow these options to override item.editable
  //   },
  min: today, // lower limit of visible range
  max: tomorrow, // upper limit of visible range
  zoomMin: 1000 * 60 * 60, // one day in milliseconds
  zoomMax: 1000 * 60 * 60 * 24, // about three months in milliseconds
  // ...
  // ...
};

function generateRandomId(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomId = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters.charAt(randomIndex);
  }

  return randomId;
}

export default function TimeLine() {
  const { eventObject } = eventState();
  // const [events, setEvents] = useState([]);
  // useEffect(() => {
  //   setEvents(
  //     Object.keys(eventObject).map((v) => {
  //       return {
  //         id: generateRandomId(10),
  //         content: v,
  //         start: moment(eventObject[v].start).toDate(),
  //         end: moment(eventObject[v].end).toDate(),
  //         type: "box",
  //         group: 1,
  //       };
  //     })
  //   );
  // }, [eventObject]);
  // console.log(events, eventObject);
  const timeline = useRef(null);

  useEffect(() => {
    Object.keys(eventObject).map((v) => {
      let item = {
        id: generateRandomId(10),
        content: v,
        start: moment(eventObject[v].start).toDate(),
        end: moment(eventObject[v].end).toDate(),
        group: 1,
      };
      timeline.current.items.add(item);
    });
    // timeline.current.timeline.redraw();
  }, [timeline]);
  return (
    <>
      {/* <button
        type="button"
        className="-mr-3 inline-flex h-12 w-12 items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        onClick={() => {
          timeline.current.items.add({
            id: "12345",
            start: new Date(2023, 8, 16, 10, 0, 0),
            end: new Date(2023, 8, 16, 12, 0, 0),
            content: "Trajectory AB",
            group: 1,
          });
          timeline.current.timeline.fit();
        }}
      >
        Add
      </button> */}
      {/* <button
        type="button"
        className="-mr-3 inline-flex h-12 w-12 items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        onClick={() => {
          var items = timeline.current.items.get();
          console.log("Z", items);
        }}
      >
        Get
      </button> */}
      <div className="h-40 [&>*]:h-full">
        <Timeline
          options={options}
          initialItems={[]}
          ref={timeline}
          initialGroups={[
            {
              id: 1,
              content: "Your Plan",
            },
            {
              id: 2,
              content: "Our Suggestion",
            },
          ]}
        />
      </div>
    </>
  );
}
