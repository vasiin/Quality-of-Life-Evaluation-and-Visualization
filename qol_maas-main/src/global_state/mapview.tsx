const INITIAL_VIEW_STATE = {
    latitude: 13.9746107,
    longitude: 100.6176317,
    zoom: 10,
    maxZoom: 20,
    maxPitch: 89,
    bearing: 0
  };

import { create } from 'zustand'

export default create((set) => ({
    view_state: INITIAL_VIEW_STATE,
    setViewState: (obj) => set((state) => ({ view_state: {
        ...state.view_state, ...obj
      } })),
}))
