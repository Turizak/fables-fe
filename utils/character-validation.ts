import type { FormError } from "#ui/types";
import type { CharacterForm } from "~/types/types";

export const characterValidate = (state: CharacterForm): FormError[] => {
    const errors = [];
    if (!state.firstName) errors.push({ path: "firstName", message: "Required" });
    if (state.firstName && state.firstName.length > 25)
      errors.push({
        path: "firstName",
        message: "Must be less than 25 characters",
      });
    if (!state.lastName) errors.push({ path: "lastName", message: "Required" });
    if (state.lastName && state.lastName.length > 25)
      errors.push({
        path: "lastName",
        message: "Must be less than 25 characters",
      });
    if (!state.class) errors.push({ path: "class", message: "Required" });
    if (!state.race) errors.push({ path: "race", message: "Required" });
    return errors;
  };