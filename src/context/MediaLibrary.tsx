import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect } from "react";
import {
  createAssetAsync,
  PermissionResponse,
  usePermissions,
} from "expo-media-library";

type MediaLibraryValue = {
  permission: PermissionResponse | null;
};

const MediaLibraryContext = createContext<MediaLibraryValue | null>(null);

export default function MediaLibraryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [permission, requestPermission] = usePermissions();

  useEffect(() => {
    if (!permission || permission.granted) return;
    requestPermission();
  }, [permission, requestPermission]);

  const storeAsset = useCallback(async (uri: string) => {
    return createAssetAsync(uri);
  }, []);

  return (
    <MediaLibraryContext.Provider value={{ permission }}>
      {children}
    </MediaLibraryContext.Provider>
  );
}

export const useMediaLibrary = () => useContext(MediaLibraryContext);
