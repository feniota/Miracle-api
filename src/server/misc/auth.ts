import { Number, String, Record, Static, Union, Literal } from "runtypes";
import crypto from "node:crypto";

const MiracleAuthTokenType = Record({
  type: Union(Literal("master"), Literal("instance")),
  instance_id: String,
  token: String,
  expires: Number,
});

export type MiracleAuthTokenType = Static<typeof MiracleAuthTokenType>;

export class MiracleAuth {
  tokens: Map<string, MiracleAuthTokenType>;
  new_token(instance_id: string): MiracleAuthTokenType {
    const token = {
      type: "instance",
      instance_id,
      token: crypto.randomBytes(32).toString("base64url"),
      expires: Date.now() + 1000 * 60 * 10,
    } as MiracleAuthTokenType;
    this.tokens.set(token.token, token);
    return token;
  }

  new_master_token(): MiracleAuthTokenType {
    const token = {
      type: "master",
      instance_id: "",
      token: crypto.randomBytes(32).toString("base64url"),
      expires: Date.now() + 1000 * 60 * 10,
    } as MiracleAuthTokenType;
    this.tokens.set(token.token, token);
    return token;
  }

  check_token = (
    token: string
  ): { valid: boolean; type?: string; instance_id?: string } => {
    const token_obj = this.tokens.get(token);
    if (token_obj) {
      if (Date.now() >= token_obj.expires) {
        return { valid: false };
      } else {
        return {
          valid: true,
          type: token_obj.type,
          instance_id: token_obj.instance_id,
        };
      }
    } else {
      return { valid: false };
    }
  };

  constructor() {
    this.tokens = new Map();
  }
}
