import { useEffect } from "react";
import { useQuiz } from "../QuizContext";

function Timer() {
  const { secondsRemaining, dispatch } = useQuiz();
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining - mins * 60;
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: "tick" });
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch]);
  return (
    <div className="timer">
      {" "}
      Time: {mins < 10 ? "0" + mins : mins}:{secs < 10 ? "0" + secs : secs}
    </div>
  );
}

export default Timer;
