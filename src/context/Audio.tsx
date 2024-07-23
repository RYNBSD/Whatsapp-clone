import { Audio } from "expo-av";
import type { ReactNode } from "react";
import { createContext, useCallback, useContext } from "react";

type AudioValue = {
  permission: Audio.PermissionResponse | null;
  checkPermission: () => Promise<boolean>;
};

const AudioContext = createContext<AudioValue | null>(null);

export default function AudioProvider({ children }: { children: ReactNode }) {
  const [permission, requestPermission] = Audio.usePermissions();

  const checkPermission = useCallback(async () => {
    if (permission && permission.granted) return true;
    const requestedPermission = await requestPermission();
    return requestedPermission.granted;
  }, [permission, requestPermission]);

  // useEffect(() => {
  //   if (cameraMode !== "video" || !isCameraOpen || !permission || permission.granted)
  //     return;
  //   (async () => {
  //     const requestedPermission = await requestPermission();
  //     if (!requestedPermission.granted) pictureCameraMode();
  //   })();
  // }, [
  //   cameraMode,
  //   isCameraOpen,
  //   permission,
  //   pictureCameraMode,
  //   requestPermission,
  // ]);

  return (
    <AudioContext.Provider value={{ permission, checkPermission }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);
