import { create } from 'zustand'

export default create((set) => ({
    selectedPlace: null,
    setSelectedPlace: (place) => set(() => ({ selectPlace: place })),
}))
