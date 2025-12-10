declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      S3_ACCESS_KEY: string;
      S3_SECRET_ACCESS_KEY: string;
      AWS_BUCKET_NAME: string;
      AWS_REGION: string;
      STRIPE_SECRET_KEY: string;
    }
  }
}

export {};
