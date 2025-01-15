import type { MiracleData } from "./data-management";

export class MiracleTask {
  // @ts-ignore: TODO
  private data: () => MiracleData;

  constructor(data: () => MiracleData) {
    this.data = data;
  }
}
