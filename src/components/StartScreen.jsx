import { useEffect, useRef, useState } from "react";
import { useQuiz } from "../QuizContext";
import { getUsernameColumn } from "../services/apiLeatherboard";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function StartScreen() {
  const { numberOfQuestions, dispatch, selectedQuestions, setSelectedQuestions, status } = useQuiz();
  const [username, setUsername] = useState("");
  const [difficulty, setDifficulty] = useState("medium");

  const inputRef = useRef(null);

  useEffect(() => {
    if (status === "ready") {
      setSelectedQuestions(numberOfQuestions);
    }

    inputRef.current.focus();
  }, [numberOfQuestions, setSelectedQuestions, status]);

  const handleQuestionCountChange = (event) => {
    setSelectedQuestions(event.target.value === "all" ? numberOfQuestions : parseInt(event.target.value));
  };

  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["leatherboards"],
    queryFn: getUsernameColumn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leatherboards"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleClick = (e) => {
    e.preventDefault();

    const userExists = data.some((user) => user.username === username);

    if (userExists) {
      toast.error("User already exists");
      return;
    }

    dispatch({ type: "setUsername", payload: username });
    dispatch({ type: "start", payload: selectedQuestions });
  };

  const handleDifficultyChange = (event) => {
    const selectedDifficulty = event.target.value;
    setDifficulty(selectedDifficulty);
    dispatch({ type: "setDifficulty", payload: selectedDifficulty });
  };

  return (
    <>
      <div className="start">
        <h1 className=" text-center text-xl lg:text-3xl font-bold">Welcome to the Quiz</h1>
        <form className="form">
          <label htmlFor="name" className=" uppercase font-regular lg:text-xl">
            Enter your Name
          </label>
          <input
            ref={inputRef}
            type="string"
            name="name"
            maxLength={15}
            placeholder="Abdur rahman"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </form>

        <div className="numberOfquestions" style={{ marginTop: "20px" }}>
          <p className=" uppercase font-regular lg:text-xl">Select the number of questions</p>
          <select
            value={selectedQuestions === numberOfQuestions ? "all" : selectedQuestions}
            onChange={handleQuestionCountChange}
            className="  w-[40%] "
          >
            <option value="all">all({numberOfQuestions})</option>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        </div>
        <div className="difficulty numberOfquestions">
          <p className=" uppercase font-regular lg:text-xl">Select Difficulty Level</p>
          <select value={difficulty} onChange={handleDifficultyChange} className="   w-[52%]">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {username.length <= 2 ? null : (
          <button className="  uppercase font-bold lg:text-lg" onClick={handleClick}>
            Start
          </button>
        )}
      </div>
    </>
  );
}

export default StartScreen;
