import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

/**
 * getRouter — factory function required by @tanstack/react-start plugin.
 * The plugin resolves "#tanstack-router-entry" to this file and expects
 * a named export called `getRouter`.
 */
export function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
