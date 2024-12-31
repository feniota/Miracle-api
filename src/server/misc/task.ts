import { MiracleData } from "./data-management";

export class MiracleTask {
  private data: () => MiracleData;

  constructor(data: () => MiracleData) {
    this.data = data;
  }
}
