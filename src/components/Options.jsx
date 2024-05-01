import { useMemo } from "react";
import { useQuiz } from "../QuizContext";

function Options() {
  const { dispatch, answer, question } = useQuiz();

  const hasAnswered = answer !== null;

  // Create an array of objects containing both options and their original indices
  const optionsWithIndices = useMemo(
    () => question.options.map((option, index) => ({ option, index })),
    [question.options]
  );
  console.log(optionsWithIndices);
  // Shuffle the array of objects
  const shuffledOptionsWithIndices = useMemo(() => {
    const shuffledArray = [...optionsWithIndices];

    shuffledArray.sort(() => Math.random() - 0.5);
    return shuffledArray;
  }, [optionsWithIndices]);

  return (
    <div className="options flex gap-2 text-sm lg:text-[16px]">
      {shuffledOptionsWithIndices.map(({ option, index }) => (
        <button
          className={`btn btn-option ${index === answer ? "answer" : " "} ${
            hasAnswered ? (index === question.correctOption ? "correct" : "wrong") : ""
          }`}
          key={index}
          disabled={hasAnswered}
          onClick={() => dispatch({ type: "newAnswer", payload: index })}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
