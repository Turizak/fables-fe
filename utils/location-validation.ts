import type { FormError } from "#ui/types";
import type { LocationForm } from "~/types/types";

export const locationValidate = (state: LocationForm): FormError[] => {
    const errors = [];
    if (!state.location) errors.push({ path: "location", message: "Required" });
    if (!state.description) errors.push({ path: "description", message: "Required" });
    return errors;
  };