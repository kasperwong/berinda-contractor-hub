declare module "cloudflare:workers" {
  /** Runtime binding supplied only in Cloudflare deployments. */
  export const env: { DB?: any };
}
