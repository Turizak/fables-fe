import type { CharacterForm } from "~/types/types";
import type { FormError } from "#ui/types";

export const characterValidate = (state: CharacterForm): FormError[] => {
    const errors = [];
    if (!state.ruleset) errors.push({ path: "ruleset", message: "Required" });
    if (!state.campaign) errors.push({ path: "campaign", message: "Required" });
    return errors;
  };