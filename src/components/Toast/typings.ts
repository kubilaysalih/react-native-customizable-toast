export type ToastProperties = {
  text: string;
  timeout?: number;
  type?: "default" | "success" | "error" | "info" | "warning";
  onPress?(): void;
  dismissible?: boolean;
  loading?: boolean;
};
