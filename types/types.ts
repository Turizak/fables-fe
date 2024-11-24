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
  ruleset?: string
  campaign?: string
  firstName?: string
  lastName?: string
  class?: string
  race?: string
  hair?: string;
  skin?: string;
  eyes?: string;
  height?: number;
  weight?: number;
  age?: number;
  gender?: string;
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

// Classes
export type AbilityScore = {
  url: string;
  name: string;
  index: string;
};

export type Proficiency = {
  url: string;
  name: string;
  index: string;
};

export type MultiClassingPrerequisite = {
  ability_score: AbilityScore;
  minimum_score: number;
};

export type MultiClassing = {
  prerequisites: MultiClassingPrerequisite[];
  proficiencies: Proficiency[];
};

export type Subclass = {
  url: string;
  name: string;
  index: string;
};

export type Class = {
  index: string;
  name: string;
  hit_die: number;
  class_levels: string;  // URL to class levels
  multi_classing: MultiClassing;
  subclasses: Subclass[];
  spellcasting: null | string;  // Could be string or null depending on whether spellcasting is defined
  spells: string;  // Can be a string, possibly URLs or other data related to spells
  url: string;
};

// Race

export type AbilityBonus = {
  bonus: number;
  ability_score: AbilityScore;
};

export type ProficiencyOption = {
  item: Proficiency;
  option_type: string;
};

export type StartingProficiencyOptions = {
  desc: string;
  from: {
    options: ProficiencyOption[];
    option_set_type: string;
  };
  type: string;
  choose: number;
};

export type Language = {
  url: string;
  name: string;
  index: string;
};

export type Trait = {
  url: string;
  name: string;
  index: string;
};

export type Subrace = {
  url: string;
  name: string;
  index: string;
};

export type Race = {
  index: string;
  name: string;
  speed: number;
  ability_bonuses: AbilityBonus[];
  ability_bonus_options: string | null;
  alignment: string;
  age: string;
  size: string;
  size_description: string;
  starting_proficiencies: Proficiency[];
  starting_proficiency_options: StartingProficiencyOptions;
  languages: Language[];
  language_desc: string;
  language_options: string | null;
  traits: Trait[];
  subraces: Subrace[];
  url: string;
};
