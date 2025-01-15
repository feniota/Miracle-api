class log {
  private part: string;

  log = (msg: unknown) => {
    if (msg) {
      console.log(`M <INFO> [${this.part}] ${msg.toString()}`);
    }
  };
  warn = (msg: unknown) => {
    if (msg) {
      console.warn(`M <WARN> [${this.part}] ${msg.toString()}`);
    }
  };
  error = (msg: unknown) => {
    if (msg) {
      console.error(`M <ERROR> [${this.part}] ${msg.toString()}`);
    }
  };
  constructor(part: string) {
    this.part = part;
  }
}

export default log;
