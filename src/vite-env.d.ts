/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_PLUS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
