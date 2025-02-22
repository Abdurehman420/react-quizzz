import { useEffect, useMemo, useRef, useState } from "react";
import { useQuiz } from "../QuizContext";
import { getUsernameColumn } from "../services/apiLeatherboard";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import profanityList from "../../profaneWords.json";

function StartScreen() {
  const { numberOfQuestions, dispatch, selectedQuestions, setSelectedQuestions, status } = useQuiz();
  const [username, setUsername] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [checkProfanity, setCheckProfanity] = useState(false);

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

  const profanceCheck = useMemo(() => {
    return profanityList.some((curseWord) => curseWord.text === username.toLowerCase());
  }, [username]);

  const handleClick = (e) => {
    e.preventDefault();
    const userExists = data.some((user) => user.username === username);

    if (userExists) {
      toast.error("User already exists");
      return;
    }

    if (checkProfanity) {
      toast.error("Username contains profanity. Please choose a different username.");
      return;
    }

    if (profanceCheck) {
      toast.error("Username contains profanity. Please choose a different username.");
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

  const handleUsernameChange = (event) => {
    const newUsername = event.target.value;
    setUsername(newUsername);

    const fetchProfanityData = async () => {
      const res = await fetch("https://vector.profanity.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newUsername }),
      });

      if (!res.ok) return;

      const data = await res.json();
      setCheckProfanity(data.isProfanity);
    };

    fetchProfanityData();
  };

  return (
    <>
      <div className="start    ">
        <h1 className=" text-center text-xl lg:text-4xl font-bold">Welcome to the Quiz</h1>
        <form className="form w-full   bg-white p-6 rounded-lg shadow-md">
          <label htmlFor="name" className=" uppercase font-bold lg:text-xl">
            Enter your Name
          </label>
          <p className=" leading-5 text-sm">
            The name you write here will also appear on the leaderboard along with your score
          </p>
          <input
            ref={inputRef}
            type="string"
            className=" text-[16px] lg:text-lg w-full"
            name="name"
            maxLength={15}
            placeholder="Abdur rahman"
            value={username}
            onChange={handleUsernameChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleClick(e);
              }
            }}
          />
        </form>

        <div className="numberOfquestions w-full   bg-white p-6 rounded-lg shadow-md" style={{ marginTop: "20px" }}>
          <p className=" uppercase  font-bold lg:text-xl">Select the number of questions</p>
          <p className=" max-w-lg leading-5 text-sm mt-3">
            You will score points based on the number of questions you select
          </p>
          <select
            value={selectedQuestions === numberOfQuestions ? "all" : selectedQuestions}
            onChange={handleQuestionCountChange}
            className="  w-full  text-[16px] lg:text-lg"
          >
            <option value="all">all({numberOfQuestions})</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
        <div className="difficulty numberOfquestions  w-full   bg-white p-6 rounded-lg shadow-md">
          <p className=" uppercase  font-bold lg:text-xl">Select Difficulty Level</p>
          <p className=" text-sm leading-5 mt-3">
            The higher the difficulty , the lesser time you have to answer the quiz questions
          </p>
          <select value={difficulty} onChange={handleDifficultyChange} className="  w-full text-[16px] lg:text-lg">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {username.length <= 2 ? null : (
          <button className="  uppercase font-bold lg:text-lg  !py-2" onClick={handleClick}>
            Start
          </button>
        )}
      </div>
    </>
  );
}

export default StartScreen;
