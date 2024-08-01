export function object2formData(obj: object) {
  const formData = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
}

export async function uri2blob(uri: string) {
  const res = await fetch(uri);
  return res.blob();
}

export function millis2time(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = (ms % 60000) / 1000;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds.toFixed()}`;
}
