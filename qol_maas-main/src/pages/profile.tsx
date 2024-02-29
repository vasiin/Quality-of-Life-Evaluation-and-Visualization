/*
  This example requires Tailwind CSS v2.0+ 
  
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  const colors = require('tailwindcss/colors')
  
  module.exports = {
    // ...
    theme: {
      extend: {
        colors: {
          sky: colors.sky,
          teal: colors.teal,
        },
      },
    },
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { Fragment, useState } from "react";
import {
  Disclosure,
  Menu,
  Switch,
  Transition,
  RadioGroup,
} from "@headlessui/react";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import TopComponent from "~/components/TopComponent";
import {
  BellIcon,
  CogIcon,
  CreditCardIcon,
  KeyIcon,
  MenuIcon,
  UserCircleIcon,
  ViewGridAddIcon,
  XIcon,
} from "@heroicons/react/outline";
const user = {
  name: "Debbie Lewis",
  handle: "deblewis",
  email: "debbielewis@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=320&h=320&q=80",
};

const plans = [
  { name: "1", value: 1 },
  { name: "2", value: 2 },
  { name: "3", value: 3 },
  { name: "4", value: 4 },
  { name: "5", value: 5 },
];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [availableToHire, setAvailableToHire] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [allowCommenting, setAllowCommenting] = useState(true);
  const [allowMentions, setAllowMentions] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(plans[1]);
  const [selectedPlan2, setSelectedPlan2] = useState(plans[1]);
  const [selectedPlan3, setSelectedPlan3] = useState(plans[1]);

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
                <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-x lg:divide-y-0">
                  <form
                    className="divide-y divide-gray-200 lg:col-span-9"
                    action="#"
                    method="POST"
                  >
                    {/* Profile section */}
                    <div className="px-4 py-6 sm:p-6 lg:pb-8">
                      <div>
                        <h2 className="text-lg font-medium leading-6 text-gray-900">
                          Profile
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                          Your preference will not be publicly visible.
                        </p>
                      </div>
                    </div>

                    {/* Privacy section */}
                    <div className="divide-y divide-gray-200 pt-6">
                      <div className="px-4 sm:px-6">
                        <div>
                          <h2 className="text-lg font-medium leading-6 text-gray-900">
                            Car Mode
                          </h2>
                          <p className="mt-1 text-sm text-gray-500">
                            Select your prefered options
                          </p>
                        </div>
                        <ul
                          role="list"
                          className="mt-2 divide-y divide-gray-200"
                        >
                          <Switch.Group
                            as="li"
                            className="flex items-center justify-between py-4"
                          >
                            <div className="flex flex-col">
                              <Switch.Label
                                as="p"
                                className="text-sm font-medium text-gray-900"
                                passive
                              >
                                Highway
                              </Switch.Label>
                              <Switch.Description className="text-sm text-gray-500">
                                Find a route that avoids major expressways or
                                highways.
                              </Switch.Description>
                            </div>
                            <Switch
                              checked={availableToHire}
                              onChange={setAvailableToHire}
                              className={classNames(
                                availableToHire ? "bg-teal-500" : "bg-gray-200",
                                "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  availableToHire
                                    ? "translate-x-5"
                                    : "translate-x-0",
                                  "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                )}
                              />
                            </Switch>
                          </Switch.Group>
                          <Switch.Group
                            as="li"
                            className="flex items-center justify-between py-4"
                          >
                            <div className="flex flex-col">
                              <Switch.Label
                                as="p"
                                className="text-sm font-medium text-gray-900"
                                passive
                              >
                                Tolls
                              </Switch.Label>
                              <Switch.Description className="text-sm text-gray-500">
                                Include toll roads, bridges, or tunnels.
                              </Switch.Description>
                            </div>
                            <Switch
                              checked={privateAccount}
                              onChange={setPrivateAccount}
                              className={classNames(
                                privateAccount ? "bg-teal-500" : "bg-gray-200",
                                "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  privateAccount
                                    ? "translate-x-5"
                                    : "translate-x-0",
                                  "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                )}
                              />
                            </Switch>
                          </Switch.Group>
                          <Switch.Group
                            as="li"
                            className="flex items-center justify-between py-4"
                          >
                            <div className="flex flex-col">
                              <Switch.Label
                                as="p"
                                className="text-sm font-medium text-gray-900"
                                passive
                              >
                                Ferries
                              </Switch.Label>
                              <Switch.Description className="text-sm text-gray-500">
                                Involve ferry crossings.
                              </Switch.Description>
                            </div>
                            <Switch
                              checked={allowCommenting}
                              onChange={setAllowCommenting}
                              className={classNames(
                                allowCommenting ? "bg-teal-500" : "bg-gray-200",
                                "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  allowCommenting
                                    ? "translate-x-5"
                                    : "translate-x-0",
                                  "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                )}
                              />
                            </Switch>
                          </Switch.Group>
                        </ul>
                      </div>
                      <div className="px-4 py-6 sm:px-6">
                        <div>
                          <h2 className="text-lg font-medium leading-6 text-gray-900">
                            Transit Mode
                          </h2>
                          <p className="mt-1 text-sm text-gray-500">
                            Select your prefered options
                          </p>
                        </div>
                        <ul
                          role="list"
                          className="mt-2 divide-y divide-gray-200"
                        >
                          <Switch.Group
                            as="li"
                            className="flex items-center justify-between py-4"
                          >
                            <div className="flex flex-col">
                              <Switch.Label
                                as="p"
                                className="text-sm font-medium text-gray-900"
                                passive
                              >
                                Bus
                              </Switch.Label>
                            </div>
                            <Switch
                              checked={availableToHire}
                              onChange={setAvailableToHire}
                              className={classNames(
                                availableToHire ? "bg-teal-500" : "bg-gray-200",
                                "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  availableToHire
                                    ? "translate-x-5"
                                    : "translate-x-0",
                                  "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                )}
                              />
                            </Switch>
                          </Switch.Group>
                          <Switch.Group
                            as="li"
                            className="flex items-center justify-between py-4"
                          >
                            <div className="flex flex-col">
                              <Switch.Label
                                as="p"
                                className="text-sm font-medium text-gray-900"
                                passive
                              >
                                Subway
                              </Switch.Label>
                            </div>
                            <Switch
                              checked={privateAccount}
                              onChange={setPrivateAccount}
                              className={classNames(
                                privateAccount ? "bg-teal-500" : "bg-gray-200",
                                "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  privateAccount
                                    ? "translate-x-5"
                                    : "translate-x-0",
                                  "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                )}
                              />
                            </Switch>
                          </Switch.Group>
                          <Switch.Group
                            as="li"
                            className="flex items-center justify-between py-4"
                          >
                            <div className="flex flex-col">
                              <Switch.Label
                                as="p"
                                className="text-sm font-medium text-gray-900"
                                passive
                              >
                                Train
                              </Switch.Label>
                            </div>
                            <Switch
                              checked={allowCommenting}
                              onChange={setAllowCommenting}
                              className={classNames(
                                allowCommenting ? "bg-teal-500" : "bg-gray-200",
                                "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  allowCommenting
                                    ? "translate-x-5"
                                    : "translate-x-0",
                                  "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                )}
                              />
                            </Switch>
                          </Switch.Group>
                        </ul>
                      </div>
                      <div className="px-4 py-6 sm:px-6">
                        <div>
                          <h2 className="text-lg font-medium leading-6 text-gray-900">
                            Personal Satisfaction
                          </h2>
                          <p className="mt-1 text-sm text-gray-500">
                            Rate your concern on each matter out of 5
                          </p>
                        </div>
                        <RadioGroup
                          value={selectedPlan}
                          onChange={setSelectedPlan}
                          className="py-4"
                        >
                          <RadioGroup.Label>
                            <h2 className="text-sm font-medium leading-6 text-gray-900">
                              Quality of Life (QoL)
                            </h2>
                          </RadioGroup.Label>
                          <div className="flex items-center space-x-3">
                            {plans.map((plan, planIdx) => (
                              <RadioGroup.Option
                                key={plan.name}
                                value={plan}
                                className={({ checked }) =>
                                  classNames(
                                    planIdx === 0
                                      ? "rounded-tl-md rounded-tr-md"
                                      : "",
                                    planIdx === plans.length - 1
                                      ? "rounded-bl-md rounded-br-md"
                                      : "",
                                    checked
                                      ? "z-10 border-orange-200 bg-orange-50"
                                      : "border-gray-200",
                                    "relative flex cursor-pointer flex-col border p-4 focus:outline-none md:grid md:grid-cols-1 md:pl-4 md:pr-6"
                                  )
                                }
                              >
                                {({ active, checked }) => (
                                  <>
                                    <div className="flex items-center text-sm">
                                      <span
                                        className={classNames(
                                          checked
                                            ? "border-transparent bg-orange-500"
                                            : "border-gray-300 bg-white",
                                          active
                                            ? "ring-2 ring-gray-900 ring-offset-2"
                                            : "",
                                          "flex h-2 w-2 items-center justify-center rounded-full border"
                                        )}
                                        aria-hidden="true"
                                      >
                                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                      </span>
                                      <RadioGroup.Label
                                        as="span"
                                        className="ml-3 font-medium text-gray-900"
                                      >
                                        {plan.name}
                                      </RadioGroup.Label>
                                    </div>
                                  </>
                                )}
                              </RadioGroup.Option>
                            ))}
                          </div>
                        </RadioGroup>
                        <RadioGroup
                          value={selectedPlan2}
                          onChange={setSelectedPlan2}
                          className="py-4"
                        >
                          <RadioGroup.Label>
                            <h2 className="text-sm font-medium leading-6 text-gray-900">
                              CO<sub className="align-baseline text-xs">2</sub>{" "}
                              Emission (CO
                              <sub className="align-baseline text-xs">2</sub>)
                            </h2>
                          </RadioGroup.Label>
                          <div className="flex items-center space-x-3">
                            {plans.map((plan, planIdx) => (
                              <RadioGroup.Option
                                key={plan.name}
                                value={plan}
                                className={({ checked }) =>
                                  classNames(
                                    planIdx === 0
                                      ? "rounded-tl-md rounded-tr-md"
                                      : "",
                                    planIdx === plans.length - 1
                                      ? "rounded-bl-md rounded-br-md"
                                      : "",
                                    checked
                                      ? "z-10 border-orange-200 bg-orange-50"
                                      : "border-gray-200",
                                    "relative flex cursor-pointer flex-col border p-4 focus:outline-none md:grid md:grid-cols-1 md:pl-4 md:pr-6"
                                  )
                                }
                              >
                                {({ active, checked }) => (
                                  <>
                                    <div className="flex items-center text-sm">
                                      <span
                                        className={classNames(
                                          checked
                                            ? "border-transparent bg-orange-500"
                                            : "border-gray-300 bg-white",
                                          active
                                            ? "ring-2 ring-gray-900 ring-offset-2"
                                            : "",
                                          "flex h-2 w-2 items-center justify-center rounded-full border"
                                        )}
                                        aria-hidden="true"
                                      >
                                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                      </span>
                                      <RadioGroup.Label
                                        as="span"
                                        className="ml-3 font-medium text-gray-900"
                                      >
                                        {plan.name}
                                      </RadioGroup.Label>
                                    </div>
                                  </>
                                )}
                              </RadioGroup.Option>
                            ))}
                          </div>
                        </RadioGroup>
                        <RadioGroup
                          value={selectedPlan3}
                          onChange={setSelectedPlan3}
                          className="py-4"
                        >
                          <RadioGroup.Label>
                            <h2 className="text-sm font-medium leading-6 text-gray-900">
                              Cost
                            </h2>
                          </RadioGroup.Label>
                          <div className="flex items-center space-x-3">
                            {plans.map((plan, planIdx) => (
                              <RadioGroup.Option
                                key={plan.name}
                                value={plan}
                                className={({ checked }) =>
                                  classNames(
                                    planIdx === 0
                                      ? "rounded-tl-md rounded-tr-md"
                                      : "",
                                    planIdx === plans.length - 1
                                      ? "rounded-bl-md rounded-br-md"
                                      : "",
                                    checked
                                      ? "z-10 border-orange-200 bg-orange-50"
                                      : "border-gray-200",
                                    "relative flex cursor-pointer flex-col border p-4 focus:outline-none md:grid md:grid-cols-1 md:pl-4 md:pr-6"
                                  )
                                }
                              >
                                {({ active, checked }) => (
                                  <>
                                    <div className="flex items-center text-sm">
                                      <span
                                        className={classNames(
                                          checked
                                            ? "border-transparent bg-orange-500"
                                            : "border-gray-300 bg-white",
                                          active
                                            ? "ring-2 ring-gray-900 ring-offset-2"
                                            : "",
                                          "flex h-2 w-2 items-center justify-center rounded-full border"
                                        )}
                                        aria-hidden="true"
                                      >
                                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                      </span>
                                      <RadioGroup.Label
                                        as="span"
                                        className="ml-3 font-medium text-gray-900"
                                      >
                                        {plan.name}
                                      </RadioGroup.Label>
                                    </div>
                                  </>
                                )}
                              </RadioGroup.Option>
                            ))}
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="mt-4 flex justify-end px-4 py-4 sm:px-6">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="ml-5 inline-flex justify-center rounded-md border border-transparent bg-sky-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </TopComponent>
      </div>
    </>
  );
}
