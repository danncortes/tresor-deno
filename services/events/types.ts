export enum Events {
  UserDeleted = "UserDeleted",
}

export interface Event {
  action: Events;
  // deno-lint-ignore no-explicit-any
  data: any;
}
