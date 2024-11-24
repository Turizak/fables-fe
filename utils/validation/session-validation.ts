import type { FormError } from "#ui/types";
import type { SessionForm} from "~/types/types";

export const sessionValidate = (state: SessionForm): FormError[] => {
    const errors = [];
    if (!state.dateOccured) errors.push({ path: "dateOccured", message: "Required" });
    if (state.partyUuids.length === 0) errors.push({ path: "characters", message: "At least one character is required" });
    return errors;
  };