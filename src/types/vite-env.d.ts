/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_SERVICE: string
  readonly VITE_SECRET_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
