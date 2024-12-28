// SPDX-License-Identifier: Apache-2.0
import type { FormError } from "#ui/types";
import type { CharacterForm } from "~/types/types";

export const characterValidate3 = (state: CharacterForm): FormError[] => {
    const errors = [];
    if (state.hair && state.hair.length > 25)
      errors.push({ path: "hair", message: "Must be less than 25 characters" });
    if (state.skin && state.skin.length > 25)
      errors.push({ path: "skin", message: "Must be less than 25 characters" });
    if (state.eyes && state.eyes.length > 25)
      errors.push({ path: "eyes", message: "Must be less than 25 characters" });
    if (state.height && state.height < 1)
      errors.push({ path: "height", message: "Must be at least 12 inches" });
    if (state.gender && state.gender.length > 25)
      errors.push({ path: "gender", message: "Must be less than 25 characters" });
    if (state.age && state.age < 1)
      errors.push({ path: "age", message: "Must be at least 1 year old" });
    if (state.weight && state.weight < 1)
      errors.push({ path: "weight", message: "Must be at least 1lb" });
    return errors;
  };