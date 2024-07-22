import { Audio } from "expo-av";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect } from "react";
import { useCamera } from "./Camera";

type AudioValue = {
  permission: Audio.PermissionResponse | null;
};

const AudioContext = createContext<AudioValue | null>(null);

export default function AudioProvider({ children }: { children: ReactNode }) {
  const [permission, requestPermission] = Audio.usePermissions();
  const { mode: cameraMode, pictureMode: pictureCameraMode } = useCamera()!;

  useEffect(() => {
    (async () => {
      if (cameraMode !== "video" || !permission || permission.granted) return;
      const requestedPermission = await requestPermission();
      if (!requestedPermission.granted) pictureCameraMode();
    })();
  }, [cameraMode, permission, pictureCameraMode, requestPermission]);

  return (
    <AudioContext.Provider value={{ permission }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);
