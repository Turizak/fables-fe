export type Props<T> = {
  data: T;
};

export type Timestamp = {
  time: string;
  valid: boolean;
};

export type TimestampFields = {
  created: Timestamp;
  lastUpdated: Timestamp | null
}

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

export type CampaignResponse = ApiResponse<{ campaign: Campaign }>;
export type CampaignsResponse = ApiResponse<{ campaigns: Campaign[] }>;
export type LocationResponse = ApiResponse<{ location: Location}>
export type LocationsResponse = ApiResponse<{ locations: Location[]}>
export type NPCResponse = ApiResponse<{ npc: NPC}>
export type NPCsResponse = ApiResponse<{ npcs: NPC[] }>;
export type QuestResponse = ApiResponse<{ quest: Quest}>
export type QuestsResponse = ApiResponse<{ quests: Quest[]}>
export type SessionResponse = ApiResponse<{ session: Session }>;
export type SessionsResponse = ApiResponse<{ sessions: Session[] }>;

// Campaign
export type Campaign = TimestampFields & {
  uuid: string;
  name: string;
  creatorUuid: string;
  dmUuid: string;
  partyUuids: string[] | null;
  completed: boolean;
  active: boolean;
  ruleset: string;
  maxPlayers: number;
};

export type CampaignForm = {
  name: string | undefined;
  ruleset: string;
  maxPlayers: number;
};

export type CampaignAll = {
  campaign: Campaign;
  characters: Character[];
  locations: Location[];
  npcs: NPC[];
  quests: Quest[];
  sessions: Session[];
};

// Character
export type Character = TimestampFields & {
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
};

export type CharacterForm = {
  ruleset?: string;
  campaign?: string;
  firstName?: string;
  lastName?: string;
  class?: string;
  race?: string;
  hair?: string;
  skin?: string;
  eyes?: string;
  height?: number;
  weight?: number;
  age?: number;
  gender?: string;
};

// Location
export type Location = TimestampFields & {
  uuid: string;
  campaignUuid: string;
  creatorUuid: string;
  name: string;
  description: string;
};

export type LocationForm = {
  location: string;
  description: string;
};

export type NoteForm = {
  campaign: string;
  session: string;
  note: string;
};

// NPC
export type NPC = {
  uuid: string;
  campaignUuid: string;
  creatorUuid: string;
  firstName: string;
  lastName: string;
  race: string;
  class: string;
  description: string;
  isQuestBoss: boolean;
  questBossUuid: string | null;
};
export type NPCForm = {
  firstName: string;
  lastName: string;
  race: string;
  class: string;
  description: string;
  isQuestBoss: boolean;
};

// Quest
export type Quest = TimestampFields & {
  uuid: string;
  campaignUuid: string;
  creatorUuid: string;
  name: string;
  description: string;
  questGiver: string;
  rewardUuids: string[];
  locationUuids: string[];
  npcUuids: string[];
  partyUuids: string[];
  bossUuids: string[];
  startingSessionUuid: string;
  endingSessionUuid: string;
  status: string;
}

export type QuestForm = {
  name: string,
  description: string,
  questGiver: { label: string, value: string }
  rewardUuids: string[] | null,
  locationUuids: string[] | null,
  npcUuids: string[] | null,
  partyUuids: string[] | null,
  bossUuids: { label: string, value: string }[],
  startingSessionUuid: { label: string, value: string }
};

// Session
export type Session = TimestampFields & {
    sessionId: number;
    uuid: string;
    campaignUuid: string;
    creatorUuid: string;
    partyUuids: string[];
    locationUuids: string[];
    npcUuids: string[];
    dateOccured: Timestamp;
};

export type SessionForm = {
  partyUuids: string[];
  dateOccured: string;
};

export type SessionAll = {
  characters: Character[];
  locations: Location[];
  npcs: NPC[];
  session: Session[];
};

export type FormData = {
  email: string;
  password: string;
};

export type FormType = {
  email: string;
  createPassword: string;
  confirmPassword: string | undefined;
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
  class_levels: string; // URL to class levels
  multi_classing: MultiClassing;
  subclasses: Subclass[];
  spellcasting: null | string; // Could be string or null depending on whether spellcasting is defined
  spells: string; // Can be a string, possibly URLs or other data related to spells
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

