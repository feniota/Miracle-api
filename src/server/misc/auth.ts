import { Number, String, Record, Static } from "runtypes";
import crypto from "node:crypto";

const MiracleAuthInstanceTokenType = Record({
  instance_id: String,
  token: String,
  expires: Number,
});

const MiracleAuthMasterTokenType = Record({
  token: String,
  expires: Number,
});

export type MiracleAuthMasterTokenType = Static<
  typeof MiracleAuthMasterTokenType
>;
export type MiracleAuthInstanceTokenType = Static<
  typeof MiracleAuthInstanceTokenType
>;

export class MiracleAuth {
  tokens: Map<string, MiracleAuthInstanceTokenType>;
  master_token: MiracleAuthMasterTokenType;
  new_token(instance_name: string): MiracleAuthInstanceTokenType {
    let token = {
      instance_id: instance_name,
      token: crypto.randomBytes(32).toString("base64url"),
      expires: Date.now() + 1000 * 60 * 10,
    };
    this.tokens.set(instance_name, token);
    return token;
  }

  new_master_token(): MiracleAuthMasterTokenType {
    let token = {
      token: "",
      expires: Date.now() + 1000 * 60 * 10,
    };
    this.master_token = token;
    return token;
  }

  validate_token(instance_name: string, token: string): boolean {
    let instance_token = this.tokens.get(instance_name);
    if (instance_token) {
      if (instance_token.token === token) {
        if (instance_token.expires > Date.now()) return true;
        else return false;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  constructor() {
    this.tokens = new Map();
    this.master_token = {
      token: "",
      expires: 0,
    };
  }
}
