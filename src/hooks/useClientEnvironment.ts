import { useSyncExternalStore } from 'react';

const subscribeNever = () => () => undefined;

/** `false` on the server and during hydration, `true` afterwards. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}

interface NetworkInformationLike extends EventTarget {
  saveData?: boolean;
  effectiveType?: string;
}

const getConnection = () => (navigator as Navigator & { connection?: NetworkInformationLike }).connection;

function subscribeConnection(onChange: () => void) {
  const connection = getConnection();
  connection?.addEventListener('change', onChange);
  return () => connection?.removeEventListener('change', onChange);
}

/** True when the visitor asked to save data or is on a very slow connection. */
export function useDataSaver(): boolean {
  return useSyncExternalStore(
    subscribeConnection,
    () => {
      const connection = getConnection();
      return (
        Boolean(connection?.saveData) || connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g'
      );
    },
    () => false,
  );
}
