export default function Leg({ route }) {
  console.log("HI", route);
  return (
    <li>
      <a href="#" className="block hover:bg-gray-50">
        <div className="rounded-md bg-white p-4 shadow-md">
          <div className="mb-4 flex items-center">
            <div className="w-2/3">
              <div className="text-xl font-bold">
                QoL: _, Travel Time: {route?.duration?.text ?? "?"}
              </div>
            </div>
            <div className="w-2/3 text-right">
              <h1 className="text-xl font-bold">
                <span>
                  {route?.departure_time?.text ?? "?"}—
                  {route?.arrival_time?.text ?? "?"}
                </span>
              </h1>
            </div>
          </div>
          <div className="mb-2 flex">
            <div className="w-full">
              <span className="flex items-center">
                {route?.steps.map((step, index) => {
                  let icon = <></>;
                  let transit_detail = <></>;
                  if (step.travel_mode === "WALKING") {
                    icon = (
                      <img
                        className="mr-2 h-5 w-5"
                        alt="Walk"
                        src="transit/svg/walk.svg"
                      />
                    );
                  } else if (step.travel_mode === "TRANSIT") {
                    if (step.transit_details.line.vehicle.type === "BUS") {
                      icon = (
                        <img
                          className="mr-2 h-5 w-5"
                          alt="Bus"
                          src="transit/svg/bus2.svg"
                        />
                      );
                    } else if (
                      step.transit_details.line.vehicle.type === "HEAVY_RAIL"
                    ) {
                      icon = (
                        <img
                          className="mr-2 h-5 w-5"
                          alt="Train"
                          src="transit/svg/rail2.svg"
                        />
                      );
                    }
                    transit_detail = (
                      <span
                        className="mr-2 truncate rounded px-2 py-1 text-black"
                        style={{
                          backgroundColor: step.transit_details.line.color,
                        }}
                      >
                        {step.transit_details.line.name}
                      </span>
                    );
                  }

                  if (index < route?.steps.length - 1) {
                    return (
                      <>
                        <>
                          {icon}
                          {transit_detail}
                        </>
                        <img
                          className="mx-1.5 my-2 mr-2 h-4 w-4"
                          alt="Next"
                          src="transit/arrow-right-1x.png"
                        />
                      </>
                    );
                  } else {
                    return (
                      <>
                        {icon}
                        {transit_detail}
                      </>
                    );
                  }
                })}
              </span>
            </div>
          </div>
          {/* <div className="mb-2 flex">
            <div className="w-1/3">
              <div className="text-sm">
                <span>Starting time at</span> _ station
              </div>
            </div>
            <div className="w-1/3">
              <span className="text-sm">$ cost</span>
            </div>
          </div> */}
          {/* <div>
            <button
              className="text-sm font-bold text-blue-600"
              aria-labelledby="section-directions-trip-details-msg-0"
            >
              <span id="section-directions-trip-details-msg-0">Details</span>
            </button>
          </div> */}
        </div>
      </a>
    </li>
  );
}
