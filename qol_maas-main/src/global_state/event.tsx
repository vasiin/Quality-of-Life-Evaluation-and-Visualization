import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export default create(
  persist(
    (set, get) => ({
      eventObject: {},
      eventList: [],
      addEventObject: (key, value) =>
        set(() => {
          return {
            eventObject: { ...get().eventObject, [key]: value },
            eventList: [...get().eventList, { ...value, key }],
          };
        }),
      deleteEventObject: (key) =>
        set(() => {
          const { [key]: tmp, ...newObject } = get().eventObject;
          const filteredList = get().eventList.filter((v) => v.key !== key);
          return { eventObject: newObject, eventList: filteredList };
        }),
    }),
    { name: "event-storage", storage: createJSONStorage(() => sessionStorage) }
  )
);
