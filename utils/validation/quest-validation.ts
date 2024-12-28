// SPDX-License-Identifier: Apache-2.0
import type { FormError } from "#ui/types";
import type { QuestForm} from "~/types/types";

export const questValidate = (state: QuestForm): FormError[] => {
    const errors = [];
    if (!state.name) errors.push({ path: "name", message: "Required" });
    if (!state.questGiver) errors.push({ path: "questGiver", message: "Required" });
    if (!state.startingSessionUuid) errors.push({ path: "startingSessionUuid", message: "Required" });
    return errors;
  };