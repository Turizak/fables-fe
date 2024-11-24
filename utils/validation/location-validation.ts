import type { FormError } from "#ui/types";
import type { LocationForm } from "~/types/types";

export const locationValidate = (state: LocationForm): FormError[] => {
    const errors = [];
    if (!state.location) errors.push({ path: "location", message: "Required" });
    if (state.location.length > 99) errors.push({path: "location", message: "Maximum 100 characters."})
    if (!state.description) errors.push({ path: "description", message: "Required" });
    if (state.description.length > 99) errors.push({path: "description", message: "Maximum 100 characters."})
    return errors;
  };