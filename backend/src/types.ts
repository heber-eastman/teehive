export interface User {
  email: string;
}

declare global {
  namespace Express {
    interface User {
      email: string;
    }
  }
} 