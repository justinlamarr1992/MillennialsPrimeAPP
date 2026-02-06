import 'axios';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    sent?: boolean;
  }
}
