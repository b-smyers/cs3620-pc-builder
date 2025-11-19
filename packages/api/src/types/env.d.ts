export type NodeEnvironment = "development" | "production" | "test";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: NodeEnvironment;
      SESSION_SECRET: string;
    }
  }
}