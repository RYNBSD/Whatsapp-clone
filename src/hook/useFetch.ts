import { useEffect, useState } from "react";
import { request } from "../util";

export function useFetch(path: string, init?: RequestInit) {
  const [response, setResponse] = useState<Response | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    setIsLoading(true);
    setResponse(null);
    setIsError(false);
    setError(null);

    const controller = new AbortController();

    (async () => {
      const response = await request(path, {
        ...init,
        signal: controller.signal,
      });
      setResponse(response);
    })()
      .catch((error) => {
        if (controller.signal.aborted) return;
        setIsError(true);
        setError(error);
      })
      .finally(() => setIsLoading(false));

    return () => {
      controller.abort();
    };
  }, [init, path]);

  return { response, isLoading, isError, error };
}
