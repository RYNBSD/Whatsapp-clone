import type { ReactNode } from "react";
import { createContext, useCallback, useContext } from "react";
import { PermissionResponse, usePermissions } from "expo-media-library";
import {
  readAsStringAsync,
  StorageAccessFramework,
  writeAsStringAsync,
} from "expo-file-system";
import { shareAsync } from "expo-sharing";
import { Platform } from "react-native";

type MediaLibraryValue = {
  permission: PermissionResponse | null;
  checkPermission: () => Promise<boolean>;
  storeAsset: (uri: string, filename: string, mime: string) => Promise<void>;
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
    async (uri: string, filename: string, mime: string) => {
      const isAllowed = await checkPermission();
      if (!isAllowed) return;

      if (Platform.OS !== "android") return shareAsync(uri);

      const permissions =
        await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) return shareAsync(uri);

      const base64 = await readAsStringAsync(uri, { encoding: "base64" });
      const newUri = await StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        filename,
        mime,
      );
      await writeAsStringAsync(newUri, base64, { encoding: "base64" });
    },
    [checkPermission],
  );

  return (
    <MediaLibraryContext.Provider
      value={{ permission, checkPermission, storeAsset }}
    >
      {children}
    </MediaLibraryContext.Provider>
  );
}

export const useMediaLibrary = () => useContext(MediaLibraryContext);
