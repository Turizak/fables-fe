import { defineStore } from "pinia";

type FormData = {
  [key: string]: string | number;
}

export const useFormStore = defineStore('form', {
  state: (): { formData: FormData } => ({
    formData: {}
  }),
  actions: {
    updateFormField(field: string, value: string | number) {
      this.formData[field] = value;
    }
  }
  });
