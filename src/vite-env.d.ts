/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SPACETIME_URI: string;
  readonly VITE_SPACETIME_DB_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
