export type MiracleGlobalVar = {
  interaction: {
    path_from: string;
    path: string;
    current: string;
    current_name: string;
    instances: { name: string; id: string }[];
  };
  api: {
    type: "instance" | "master";
    token: string;
    expires: number;
  };
};

declare global {
  interface Window {
    miracle: MiracleGlobalVar;
  }
}

window.miracle = {
  interaction: {
    path: "/none",
    path_from: "/none",
    current: "",
    current_name: "",
    instances: [],
  },
  api: { type: "instance", token: "", expires: 0 },
};
