// SPDX-License-Identifier: Apache-2.0
import type { FormError } from "#ui/types";
import type { FormData } from "~/types/types";

export const loginValidate = (state: FormData): FormError[] => {
    const errors = [];
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!state.email) errors.push({ path: "email", message: "Required" });
    if (!emailRegex.test(state.email))
      errors.push({ path: "email", message: "Invalid email address" });
    if (!state.password) errors.push({ path: "password", message: "Required" });
    return errors;
  };