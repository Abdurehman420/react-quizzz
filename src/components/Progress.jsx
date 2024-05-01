import { useQuiz } from "../QuizContext";

function Progress() {
  const { numberOfQuestions, index, points, maxPoints, answer } = useQuiz();
  return (
    <header className="progress flex flex-col gap-1">
      <progress max={numberOfQuestions} value={index + Number(answer !== null)} />
      <p className=" text-sm lg:text-lg font-regular">
        Question {index + 1} / {numberOfQuestions}
      </p>
      <p className=" text-sm lg:text-lg font-regular">
        {points} / {maxPoints}
      </p>
    </header>
  );
}

export default Progress;
