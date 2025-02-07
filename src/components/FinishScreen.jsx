import { useQuiz } from "../QuizContext";

function FinishScreen({ setExplosion }) {
  const {
    points,
    maxPoints,
    correctAnswers,
    wrongAnswers,
    secondsRemaining,
    selectedQuestions,
    numberOfQuestions,
    username,
    difficulty,
    restartQuiz,
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

  const handleClick = () => {
    restartQuiz();
    setExplosion(false);
  };

  return (
    <div className="result flex flex-col gap-0">
      <div className="endingText self-start  w-full flex flex-col   ">
        <h1 className=" text-xl lg:text-3xl  mb-12">Congrats on finishing the quiz</h1>
        <p className=" text-left text-sm lg:text-lg text-slate-900">
          You scored {points} out of {maxPoints}
        </p>
      </div>

      <ul className=" text-[15px] lg:text-lg">
        <li className=" text-xl lg:text-3xl">
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
      <button className=" neoBtn   lg:text-lg " onClick={handleClick}>
        Restart Quiz
      </button>
    </div>
  );
}

export default FinishScreen;
