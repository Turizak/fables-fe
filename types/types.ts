export type ApiResponse<T> = {
  data: T;
  message: string;
  status: number;
  statusText: string;
  timestamp: string;
};

export type AuthResponse = {
  data: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
  message: string;
  status: number;
  statusText: string;
  timestamp: string;
};

export type Campaign = {
  uuid: string;
  name: string;
  creatorUuid: string;
  dmUuid: string;
  partyUuids: string[];
  completed: boolean;
  active: boolean;
  ruleset: string;
  maxPlayers: number;
  created: Timestamp;
  lastUpdated: Timestamp | null;
};

export type CampaignAll = {
  campaign: {
    uuid: string;
    name: string;
    creatorUuid: string;
    dmUuid: string;
    partyUuids: string[];
    completed: boolean;
    active: boolean;
    ruleset: string;
    maxPlayers: number;
    created: Timestamp
    lastUpdated: Timestamp | null
  };
  characters: Array<{
    uuid: string;
    campaignUuid: string;
    creatorUuid: string;
    ownerUuid: string;
    firstName: string;
    lastName: string;
    race: string;
    class: string;
    age: number;
    height: number;
    weight: number;
    eyeColor: string;
    skinColor: string;
    hairColor: string;
    ruleset: string;
    public: boolean;
    gender: string | null;
    created: Timestamp,
    lastUpdated: Timestamp | null
  }>;
  locations: Array<{
    uuid: string;
    campaignUuid: string;
    creatorUuid: string;
    name: string;
    description: string;
    created: Timestamp
    lastUpdated: Timestamp | null
  }>;
  npcs: Array<{
    uuid: string;
    campaignUuid: string;
    creatorUuid: string;
    firstName: string;
    lastName: string;
    race: string;
    class: string;
    description: string;
    isQuestBoss: boolean;
    created: Timestamp
    lastUpdated: Timestamp | null
  }>;
  sessions: Array<{
      sessionId: number,
      uuid: string,
      campaignUuid: string,
      creatorUuid: string,
      partyUuids: string[],
      dateOccured: Timestamp,
      created: Timestamp,
      lastUpdated: Timestamp | null
}>
};

export type Character = {
  uuid: string;
  campaignUuid: string;
  creatorUuid: string;
  ownerUuid: string;
  firstName: string;
  lastName: string;
  race: string;
  class: string;
  age: number;
  height: number;
  weight: number;
  eyeColor: string;
  skinColor: string;
  hairColor: string;
  ruleset: string;
  created: Timestamp
  lastUpdated: Timestamp | null
};

export type CampaignForm = {
  name: string | undefined;
  ruleset: string;
  maxPlayers: number;
};

export type CharacterForm = {
  ruleset: string;
  campaign: string;
};

export type NPCForm = {
  firstName: string;
  lastName: string;
  race: string;
  class: string;
  description: string;
  isQuestBoss: boolean;
}

export type LocationForm = {
  location: string;
  description: string;
}

export type SessionForm = {
  partyUuids: string[];
  dateOccured: string;
}

export type FormData = {
  email: string;
  password: string;
};

export type FormType = {
  email: string;
  createPassword: string;
  confirmPassword: string | undefined;
};

export type Props<T> = {
  data: T;
};

export type Timestamp = {
  time: string;
  valid: boolean;
};
