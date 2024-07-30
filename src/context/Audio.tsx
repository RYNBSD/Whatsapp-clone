// eslint-disable-next-line import/no-unresolved
import { BASE_URL } from "@env";
import type { ReactNode } from "react";
import { Audio, type AVPlaybackStatusSuccess } from "expo-av";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  useTransition,
} from "react";
import { readAsStringAsync } from "expo-file-system";

type AudioValue = {
  recordingStatus: Audio.RecordingStatus | null;
  checkPermission: () => Promise<boolean>;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  sounds: Record<string, Audio.Sound>;
  soundsStatus: Record<string, AVPlaybackStatusSuccess>;
  initSound: (key: string, uri: string) => Promise<void>;
  clearSound: (key: string) => Promise<void>;
};

const AudioContext = createContext<AudioValue | null>(null);

export default function AudioProvider({ children }: { children: ReactNode }) {
  const [_isPending, startTransition] = useTransition();

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingStatus, setRecordingStatus] =
    useState<Audio.RecordingStatus | null>(null);

  const [sounds, setSounds] = useState<Record<string, Audio.Sound>>({});
  const [soundsStatus, setSoundsStatus] = useState<
    Record<string, AVPlaybackStatusSuccess>
  >({});

  const [permission, requestPermission] = Audio.usePermissions();

  const checkPermission = useCallback(async () => {
    if (permission && permission.granted) return true;
    const requestedPermission = await requestPermission();
    return requestedPermission.granted;
  }, [permission, requestPermission]);

  const initSound = useCallback(async (key: string, uri: string) => {
    const { sound, status } = await Audio.Sound.createAsync(
      { uri: `${BASE_URL}/${uri}` },
      {},
      (status) => {
        startTransition(() => {
          if (!status.isLoaded) return;
          setSoundsStatus((prev) => ({ ...prev, [key]: status }));
        });
      }
    );

    setSounds((prev) => ({ ...prev, [key]: sound }));

    if (!status.isLoaded) return;
    setSoundsStatus((prev) => ({ ...prev, [key]: status }));
  }, []);

  const clearSound = useCallback(
    async (key: string) => {
      if (typeof sounds[key] === "undefined") return;
      await sounds[key].unloadAsync();
      setSounds((prev) => {
        delete prev[key];
        return { ...prev };
      });

      if (typeof soundsStatus[key] === "undefined") return;
      setSoundsStatus((prev) => {
        delete prev[key];
        return { ...prev };
      });
    },
    [sounds, soundsStatus]
  );

  const startRecording = useCallback(async () => {
    const isAllowed = await checkPermission();
    if (!isAllowed) return;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording, status } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
      (status) => {
        startTransition(() => {
          setRecordingStatus(status);
        });
      }
    );
    setRecording(recording);
    setRecordingStatus(status);
  }, [checkPermission]);

  const stopRecording = useCallback(async () => {
    if (recording === null) return null;
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    const uri = recording.getURI();
    setRecording(null);
    setRecordingStatus(null);
    if (uri === null || uri.length === 0) return null;
    return readAsStringAsync(uri, { encoding: "base64" });
  }, [recording]);

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
    <AudioContext.Provider
      value={{
        recordingStatus,
        checkPermission,
        startRecording,
        stopRecording,
        sounds,
        soundsStatus,
        initSound,
        clearSound,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);
