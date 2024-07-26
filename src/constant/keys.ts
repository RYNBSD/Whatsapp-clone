export default {
  HTTP: {
    HEADERS: {
      CSRF: "X-CSRF",
      JWT: "X-JWT",
      ACCESS_TOKEN: "Access-Token",
      METHOD_OVERRIDE: "X-HTTP-Method-Override",
      RESPONSE_TIME: "X-Response-Time",
      NO_COMPRESSION: "No-Compression",
    },
  },
  COOKIE: {
    AUTHORIZATION: "authorization",
    SESSION: "session",
    TOKEN: "token",
  },
  GLOBAL: {
    PUBLIC: "public",
    UPLOAD: "upload",
  },
  UPLOAD: {
    IMAGE: "image",
    IMAGES: "images",
    VIDEOS: "videos",
  },
  ERROR: {
    HANDLERS: ["controller", "middleware", "socket", "server", "passport"],
  },
  CACHE: {
    COLLECTION: {
      SESSION: "Session",
      SOCKET: "Socket",
    },
  },
  REQUEST: {
    PARAMS: {
      ID: {
        USER: "userId",
      },
    },
  },
} as const;
