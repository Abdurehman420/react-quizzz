import Options from "./Options";
import { useQuiz } from "../QuizContext";

function Question() {
  const { question, dispatch, answer } = useQuiz();
  return (
    <div className=" flex flex-col  gap-5">
      <h2 className=" text-lg lg:text-xl">{question.question}</h2>
      <div className="options ">
        <Options question={question} dispatch={dispatch} answer={answer} />
      </div>
    </div>
  );
}

export default Question;
