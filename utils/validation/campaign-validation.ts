// SPDX-License-Identifier: Apache-2.0
import type { FormError } from "#ui/types";
import type { CampaignForm } from "~/types/types";

export const campaignValidate = (state: CampaignForm): FormError[] => {
    const errors = [];
    if (!state.name) errors.push({ path: "name", message: "Required" });
    if (state.name && state.name.length > 100)
      errors.push({ path: "name", message: "Must be less than 100 characters" });
    return errors;
  };