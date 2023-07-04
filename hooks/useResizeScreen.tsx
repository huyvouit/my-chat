import { useEffect, useState } from "react";
import useDebounce from "./useDebounce";
import useMobileDetect from "./useMobileDetect";
import { BreakPoints } from "utils/styled-constants";

interface IScreen {
  width: number;
  height: string | number;
  isMobile: boolean;
}

function useResizeScreen() {
  const { isMobile } = useMobileDetect();

  const [screen, setScreen] = useState<IScreen>({
    width: isMobile() ? BreakPoints.$sm : BreakPoints.$xxl,
    height: '100vh',
    isMobile: isMobile(),
  });

  const changesScreen = useDebounce<IScreen>(screen, 500);

  const handleResize = () => {
    setScreen({
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: window.innerWidth <= BreakPoints.$md
    });
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    width: changesScreen.width,
    height: changesScreen.height,
    isMobile: changesScreen.isMobile,
  };
}

export default useResizeScreen;