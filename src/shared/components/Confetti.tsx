import { useEffect, useState } from "react";
import Confetti from "react-confetti";

type Props = {
  isVisible: boolean;
};
export default ({ isVisible }: Props) => {
  const [showConfetti, setShowConfetti] = useState(isVisible);

  useEffect(() => {
    setShowConfetti(isVisible);
  }, [isVisible]);
  
  useEffect(() => {
    let clearTimer: any;
    if (isVisible) {
      clearTimer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
    return () => clearTimeout(clearTimer);
  }, [isVisible]);

  return <Confetti opacity={showConfetti ? 1 : 0} />;
};
