import { FormHTMLAttributes } from "react";

declare module "react" {
  interface FormHTMLAttributes<HTMLFormElement> {
    action?:
      | string
      | ((fromData: FormData) => void | Promise<void>)
      | ((formData: FormData) => any)
      | undefined;
  }
}
