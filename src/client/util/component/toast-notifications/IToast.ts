export enum ToastType {
  success,
  error,
  warning
}

export interface IToast {
  message: string,
  type: ToastType
}
