import type { FormError } from "#ui/types";
import type { FormType } from "~/types/types";

export const validate = (state: FormType): FormError[] => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/;
    const errors = [];
    if (!state.email) errors.push({ path: "email", message: "Required" });
    if (!emailRegex.test(state.email))
      errors.push({ path: "email", message: "Invalid email address" });
    if (!state.createPassword)
      errors.push({ path: "createPassword", message: "Required" });
    if (!passwordRegex.test(state.createPassword))
      errors.push({
        path: "createPassword",
        message: "Password does not meet requirements",
      });
    if (!state.confirmPassword)
      errors.push({ path: "confirmPassword", message: "Required" });
    if (state.confirmPassword !== state.createPassword)
      errors.push({ path: "confirmPassword", message: "Passwords do not match" });
    return errors;
  };