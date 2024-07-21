export default {
  HTTP: {
    HEADERS: {
      CSRF: "X-CSRF-Token",
      JWT: "X-JWT-Token",
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
  DB: {
    CASCADE: "CASCADE",
    ID: {
      // PRIMARY_KEY: {
      //   ID: "id",
      // },
      // FOREIGN_KEY: {
      //   USER: "userId",
      //   STORE: "storeId",
      //   CATEGORY: "categoryId",
      //   PRODUCT: "productId",
      //   TAG: "tagId",
      // },
    },
    TABLES: {
      // USER: {
      //   TABLE: "User",
      //   SETTING: "UserSetting",
      // },
      // STORE: {
      //   TABLE: "Store",
      //   SETTING: "StoreSetting",
      //   LINK: "StoreLink",
      //   VIEWER: "StoreViewer",
      // },
      // CATEGORY: {
      //   TABLE: "Category",
      //   VIEWER: "CategoryViewer",
      // },
      // PRODUCT: {
      //   TABLE: "Product",
      //   INFO: "ProductInfo",
      //   IMAGE: "ProductImage",
      //   RATING: "ProductRating",
      //   SIZE: "ProductSize",
      //   COLOR: "ProductColor",
      //   VIEWER: "ProductViewer",
      //   TAG: "ProductTag",
      // },
      // TAG: "Tag",
      // ORDER: "Order",
      // RESPONSE_TIME: "ResponseTime",
      // SERVER_ERROR: "ServerError",
      // SESSION: "Session",
    },
    MODELS: {
      // USER: {
      //   MODEL: "user",
      //   SETTING: "user-setting",
      // },
      // STORE: {
      //   MODEL: "store",
      //   SETTING: "store-setting",
      //   LINK: "store-link",
      //   VIEWER: "store-viewer",
      // },
      // CATEGORY: {
      //   MODEL: "category",
      //   VIEWER: "category-viewer",
      // },
      // PRODUCT: {
      //   MODEL: "product",
      //   INFO: "product-info",
      //   IMAGE: "product-image",
      //   RATING: "product-rating",
      //   SIZE: "product-size",
      //   COLOR: "product-color",
      //   VIEWER: "product-viewer",
      //   TAG: "product-tag",
      // },
      // TAG: "tag",
      // ORDER: "order",
      // RESPONSE_TIME: "response-time",
      // SERVER_ERROR: "server-error",
    },
  },
  CACHE: {
    // COLLECTIONS: {
    //   RATE_LIMIT: "RateLimit",
    //   SESSION: "Session",
    //   SOCKET: "Socket",
    // },
  },
  REQUEST: {
    PARAMS: {
      ID: {
        USER: "userId",
        STORE: "storeId",
        CATEGORY: "categoryId",
        PRODUCT: "productId",
        ORDER: "orderId",
        CUSTOMER: "customerId",
      },
    },
  },
} as const;
