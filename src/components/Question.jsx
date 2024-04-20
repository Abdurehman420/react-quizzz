import Options from "./Options";
import { useQuiz } from "../QuizContext";

function Question() {
  const { question, dispatch, answer } = useQuiz();
  return (
    <div className="">
      <h2 style={{ fontSize: "25px" }}>{question.question}</h2>
      <div className="options">
        <Options question={question} dispatch={dispatch} answer={answer} />
      </div>
    </div>
  );
}

export default Question;
