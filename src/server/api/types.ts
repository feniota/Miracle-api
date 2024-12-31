import { Number, String, Record, Static, Boolean } from "runtypes";

export const ReqWebAuthMaster = Record({
  key: String,
});
export type ReqWebAuthMaster = Static<typeof ReqWebAuthMaster>;

export const ReqWebAuthInstance = Record({
  id: String,
  key: String,
});
export type ReqWebAuthInstance = Static<typeof ReqWebAuthInstance>;

export const ReqNewInstance = Record({
  token: String,
  name: String,
  id: String,
});
export type ReqNewInstance = Static<typeof ReqNewInstance>;

export const ReqRemoveInstance = Record({
  token: String,
  id: String,
});

export type ReqRemoveInstance = Static<typeof ReqRemoveInstance>;

export const ResToken = Record({
  success: Boolean,
  token: String,
  expires: Number,
});
export type ResToken = Static<typeof ResToken>;

export const ResError = Record({
  success: Boolean,
  msg: String,
});
export type ResError = Static<typeof ResError>;

export const ResInstance = Record({
  id: String,
  name: String,
});
export type ResInstance = Static<typeof ResInstance>;

export const ResNewInstance = Record({
  success: Boolean,
  key: String,
});
export type ResNewInstance = Static<typeof ResNewInstance>;
