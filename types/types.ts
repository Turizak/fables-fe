export type ApiResponse<T> = {
    data: T;
    message: string;
    status: number;
    statusText: string;
    timestamp: string;
}

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
    created: {
      time: string;
      valid: boolean;
    };
    lastUpdated: null | string;
  };
  
  export type CampaignForm = {
    name: string | undefined;
    ruleset: string;
    maxPlayers: number;
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

  export type Timestamp = {
    time: string;
    valid: boolean;
  };