import type { ReactNode } from "react";
import { createContext, useCallback, useContext } from "react";
import {
  createAssetAsync,
  PermissionResponse,
  usePermissions,
} from "expo-media-library";

type MediaLibraryValue = {
  permission: PermissionResponse | null;
  checkPermission: () => Promise<boolean>;
};

const MediaLibraryContext = createContext<MediaLibraryValue | null>(null);

export default function MediaLibraryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [permission, requestPermission] = usePermissions();

  const checkPermission = useCallback(async () => {
    if (permission && permission.granted) return true;
    const requestedPermission = await requestPermission();
    return requestedPermission.granted;
  }, [permission, requestPermission]);

  // useEffect(() => {
  //   if (!permission || permission.granted) return;
  //   (async () => {
  //     const requestedPermission = await requestPermission();
  //   })();
  // }, [permission, requestPermission]);

  const storeAsset = useCallback(
    async (uri: string) => {
      const isAllowed = await checkPermission();
      if (!isAllowed) return;
      return createAssetAsync(uri);
    },
    [checkPermission],
  );

  return (
    <MediaLibraryContext.Provider value={{ permission, checkPermission }}>
      {children}
    </MediaLibraryContext.Provider>
  );
}

export const useMediaLibrary = () => useContext(MediaLibraryContext);
