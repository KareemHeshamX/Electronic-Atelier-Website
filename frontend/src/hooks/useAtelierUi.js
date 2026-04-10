import { useEffect } from "react";
import { initAtelierUi } from "../../assets/js/main";

export function useAtelierUi(title) {
  useEffect(() => {
    if (title) document.title = title;
    const cleanup = initAtelierUi();
    return () => cleanup();
  }, [title]);
}
