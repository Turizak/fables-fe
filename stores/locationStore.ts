import { defineStore } from "pinia";

export const useLocationStore = defineStore("locationStore", {
  state: () => ({
    locations: [] as string[],
  }),
  actions: {
    setLocations(uuids: string[]) {
      this.locations = uuids;
    },
    addLocation(uuid: string) {
      if (!this.locations.includes(uuid)) {
        this.locations.push(uuid);
      }
    },
  },
});