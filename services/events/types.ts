export enum Events {
  UserCreated = "UserCreated",
  AccountVerified = "AccountVerified",
}

export interface Event {
  action: Events;
  // deno-lint-ignore no-explicit-any
  data: any;
}
