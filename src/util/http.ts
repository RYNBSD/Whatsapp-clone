export async function request(path: string, init?: RequestInit) {
  return fetch(`http://192.168.1.48:8000${path}`, {
    ...init,
    credentials: "include",
  });
}
