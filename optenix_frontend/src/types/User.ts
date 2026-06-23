export interface User {

//   All data
  _id: string;
  name: string;
  email: string;
  role: "user" | "ADMIN";

  // Optional user info (used in checkout)
  mobile?: string;
  address?: string;

  // JWT token
  token?: string;
}