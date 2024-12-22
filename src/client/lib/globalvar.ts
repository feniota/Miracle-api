export type MiracleGlobalVar = {
  interaction: {
    path: string;
    current: string;
    current_name: string;
    instances: { name: string; id: string }[];
  };
  api: {
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
  interaction: { path: "/", current: "", current_name: "", instances: [] },
  api: { token: "", expires: 0 },
};
