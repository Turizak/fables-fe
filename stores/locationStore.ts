import { defineStore } from "pinia";

export const useLocationStore = defineStore("locationStore", {
  state: () => ({
    locations: [] as string[],
    npcs: [] as string[],
    characters: [] as string[]

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
    setNpcs(uuids: string[]) {
      this.npcs = uuids;
    },
    addNpc(uuid: string) {
      if(!this.npcs.includes(uuid)) {
        this.npcs.push(uuid);
      }
    },
    setCharacters(uuids: string[]) {
      this.characters = uuids;
    },
    addCharacter(uuid: string) {
      if (!this.characters.includes(uuid)) {
        this.characters.push(uuid);
      }
    }
  },
});