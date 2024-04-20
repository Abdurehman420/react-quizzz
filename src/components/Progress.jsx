import { useQuiz } from "../QuizContext";

function Progress() {
  const { numberOfQuestions, index, points, maxPoints, answer } = useQuiz();
  return (
    <header className="progress">
      <progress max={numberOfQuestions} value={index + Number(answer !== null)} />
      <p>
        Question {index + 1} / {numberOfQuestions}
      </p>
      <p>
        {points} / {maxPoints}
      </p>
    </header>
  );
}

export default Progress;
