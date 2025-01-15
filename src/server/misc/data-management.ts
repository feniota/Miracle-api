import {
  // biome-ignore lint/suspicious/noShadowRestrictedNames:
  Number, // biome-ignore lint/suspicious/noShadowRestrictedNames:
  String, // biome-ignore lint/suspicious/noShadowRestrictedNames:
  Array,
  Record,
  type Static,
  Literal,
  Union,
} from "runtypes";
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { type BinaryLike, createHash, randomBytes } from "node:crypto";

export const MiracleInstanceDataType = Record({
  api_key: String,
  name: String,
  id: String,
  config: Record({
    schedule: Array(Array(String)),
    schedule_divider_indexes: Array(Number),
    cee_date: String,
    weather_city: String,
  }),
  slogan: Record({
    content: String,
    author: String,
  }),
  wallpaper: Record({
    last_updated: Number,
    path: String,
    source: Union(Literal("spotlight"), Literal("bing"), Literal("manunal")),
  }),
});

export type MiracleInstanceDataType = Static<typeof MiracleInstanceDataType>;

export const MiracleDataType = Record({
  version: Literal("v1"),
  common: Record({
    master_key: String,
    weather: Record({
      key: String,
    }),
    binary: Record({
      version: String,
      path: String,
    }),
    instances: Array(MiracleInstanceDataType),
  }),
});

export type MiracleDataType = Static<typeof MiracleDataType>;

function hash(obj: BinaryLike): string {
  return createHash("sha256").update(obj).digest("hex");
}

export class MiracleData {
  private data_directory: string;
  private config_filename: string;
  private _data: MiracleDataType;

  write = async () => {
    return writeFile(
      path.join(this.data_directory, this.config_filename),
      JSON.stringify(this._data),
      "utf-8",
    );
  };

  static async init_from_file(file_path: string) {
    let dataraw: string;
    let dataobj: MiracleDataType;
    try {
      dataraw = await readFile(file_path, "utf8");
    } catch (e) {
      console.error(
        `Fatal error occured when reading data from file: \n${e}\nshutting down...`,
      );
      process.exit(1);
    }
    try {
      dataobj = JSON.parse(dataraw);
    } catch (e) {
      console.error(
        `Fatal error occured when parsing data from file: \n${e}\nshutting down...`,
      );
      process.exit(1);
    }
    if (dataobj.version === "v1") {
      try {
        dataobj = MiracleDataType.check(dataobj);
      } catch (e) {
        console.error(
          "Fatal error occured when parsing data from file: \nUnmatched types.\nshutting down...",
        );
        console.error(`\ndetails: ${e}`);
        process.exit(1);
      }
      return new MiracleData(
        dataobj,
        path.dirname(file_path),
        path.basename(file_path),
      );
    }
    console.error(
      "Fatal error occured when parsing data from file: \nUnknown version.\nshutting down...",
    );
    process.exit(1);
  }

  static new_dataset(file_path: string) {
    return new MiracleData(
      {
        version: "v1",
        common: {
          master_key: "",
          weather: {
            key: "",
          },
          binary: {
            version: "",
            path: "",
          },
          instances: [],
        },
      },
      path.dirname(file_path),
      path.basename(file_path),
    );
  }

  make_master_key = () => {
    const rawkey = randomBytes(32).toString("base64url");
    this._data.common.master_key = hash(rawkey);
    console.log(
      `New master key generated:\n\n${rawkey}\n\nWARNING: This only shows up once, so make sure to copy it somewhere safe!`,
    );
  };

  check_master_key = (key: string) => {
    return this._data.common.master_key === hash(key);
  };

  check_instance_key = (instance_name: string, key: string): boolean => {
    let result = false;
    //this._data.common.instances.forEach((element) => {
    for (const element of this._data.common.instances) {
      if (element.name === instance_name) {
        result = element.api_key === hash(key);
      }
    }
    return result;
  };

  remove_instance = (id: string): boolean => {
    const index = this._data.common.instances.findIndex(
      (element) => element.id === id,
    );
    if (index === -1) {
      return false;
    }
    this._data.common.instances.splice(index, 1);
    return true;
  };

  new_instance = (name: string, id: string): string => {
    let exist = false;
    //this._data.common.instances.forEach((element) => {
    for (const element of this._data.common.instances) {
      if (element.id === id) {
        exist = true;
      }
    }
    if (exist) {
      return "";
    }
    const key = randomBytes(32).toString("base64url");
    this._data.common.instances.push({
      api_key: hash(key),
      name: name,
      id: id,
      wallpaper: {
        last_updated: 0,
        path: "",
        source: "manunal",
      },
      config: {
        weather_city: "",
        schedule: [],
        schedule_divider_indexes: [],
        cee_date: "",
      },
      slogan: {
        content: "",
        author: "",
      },
    });
    return key;
  };

  get_instances = () => {
    return this._data.common.instances;
  };

  set_weather_key = (key: string) => {
    this._data.common.weather.key = key;
  };

  get_instance_config = (instance_id: string) => {
    return this._data.common.instances.find(
      (element) => element.id === instance_id,
    )!.config;
  };

  constructor(data: MiracleDataType, dir: string, config_filename: string) {
    this.data_directory = dir;
    this._data = data;
    this.config_filename = config_filename;
  }
}
