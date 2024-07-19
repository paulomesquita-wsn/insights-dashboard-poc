export class Env {
  private static getEnvOrThrow(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
  }

  private static getEnvOrDefault<T>(key: string, defaultValue: T): string | T {
    return process.env[key] || defaultValue;
  }


  static get influxDB(){
    return {
      token: Env.getEnvOrThrow('INFLUXDB_TOKEN'),
      url: Env.getEnvOrDefault('INFLUXDB_URL', 'http://localhost:8086'),
    }
  }
}