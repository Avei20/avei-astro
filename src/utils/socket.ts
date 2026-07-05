// Singleton socket.io client for browser-only islands (chat demo).
// Replaces the old Nuxt `plugins/socket.ts` provide. This module is only ever
// imported by `client:only="vue"` islands, so it never runs during SSR.
import { io, type Socket } from "socket.io-client";

const API_BASE = import.meta.env.PUBLIC_API || "https://nest.avei.ovh";

export const socket: Socket = io(API_BASE, { autoConnect: true });
