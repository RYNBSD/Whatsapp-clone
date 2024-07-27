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
