declare namespace NodeJS {
  interface ProcessEnv {
    readonly STAGE: 'local' | 'production' | undefined;
    readonly DATABASE_URL: string | undefined;
  }
}
