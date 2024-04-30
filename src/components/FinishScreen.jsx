import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuiz } from "../QuizContext";
import { createLeatherBoard } from "../services/apiLeatherboard";
import toast from "react-hot-toast";

function FinishScreen({ setExplosion }) {
  const {
    points,
    maxPoints,
    dispatch,
    correctAnswers,
    wrongAnswers,
    secondsRemaining,
    selectedQuestions,
    numberOfQuestions,
    username,
    difficulty,
  } = useQuiz();

  const calculateTimeBasedOnDifficulty = () => {
    if (difficulty === "easy") {
      return 30;
    } else if (difficulty === "medium") {
      return 20;
    } else {
      return 15;
    }
  };

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining === -1 ? 0 : secondsRemaining - mins * 60;

  const totalmins = Math.floor((selectedQuestions * calculateTimeBasedOnDifficulty()) / 60);
  const totalsecs = selectedQuestions * calculateTimeBasedOnDifficulty() - totalmins * 60;

  const LeaderBoardData = {
    username: username,
    total_questions: selectedQuestions,
    scored_points: points,
    time_taken: secondsRemaining === -1 ? selectedQuestions * calculateTimeBasedOnDifficulty() : secondsRemaining,
    total_points: maxPoints,
    total_time: selectedQuestions * calculateTimeBasedOnDifficulty(),
  };

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: createLeatherBoard,
    onSuccess: () => {
      toast.success("Score saved. Check the leaderboard");
      queryClient.invalidateQueries({ queryKey: ["leatherboards"] });
    },
    onError: () => {
      toast.error("error  saving score to leaderboard");
    },
  });
  const handleClick = () => {
    dispatch({ type: "restart" });
    setExplosion(false);
    mutate(LeaderBoardData);
  };

  return (
    <div className="result">
      <h1>Congrats on finishing the quiz</h1>
      <ul>
        <li style={{ fontSize: "25px" }}>
          <span>Username</span>
          <span> {username}</span>
        </li>
        <li style={{ color: "green" }}>
          <span>Correct Answers</span>
          <span> {correctAnswers}</span>
        </li>
        <li style={{ color: "red" }}>
          <span>Wrong Answers</span>
          <span>{wrongAnswers}</span>
        </li>
        <li>
          <span>Total Questions</span>
          <span>{numberOfQuestions}</span>
        </li>
        <li style={{ color: "green" }}>
          <span>Scored Points</span>
          <span>{points}</span>
        </li>
        <li>
          <span>Max Points</span>
          <span>{maxPoints}</span>
        </li>
        <li style={{ color: "green" }}>
          <span>Time taken</span>
          <span>
            {secondsRemaining === -1
              ? `${totalmins < 10 ? "0" + totalmins : totalmins}:${totalsecs < 10 ? "0" + totalsecs : totalsecs}`
              : `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`}
          </span>
        </li>
        <li>
          <span>Total Time</span>
          <span>
            {" "}
            {totalmins < 10 ? "0" + totalmins : totalmins}:{totalsecs < 10 ? "0" + totalsecs : totalsecs}
          </span>
        </li>
      </ul>
      <button className="btn btn-ui" onClick={handleClick}>
        Restart Quiz
      </button>
    </div>
  );
}

export default FinishScreen;
