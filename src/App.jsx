import "./App.css";
import Header from "./components/Header.jsx";
import Loader from "./components/Loader.jsx";
import Error from "./components/Error.jsx";
import StartScreen from "./components/StartScreen.jsx";
import Question from "./components/Question.jsx";
import Progress from "./components/Progress.jsx";
import FinishScreen from "./components/FinishScreen.jsx";
import Timer from "./components/Timer.jsx";
import { IoMdClose } from "react-icons/io";
import { getLeatherBoards } from "./services/apiLeatherboard";
import { useQuiz } from "./QuizContext.jsx";
import LeaderBoaardTable from "./components/LeaderBoaardTable";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Login from "./components/Login.jsx";
import AddQuestion from "./components/AddQuestion.jsx";
import ConfettiExplosion from "react-confetti-explosion";
import { logOut } from "./services/apiAuth.js";
import { useFetchQuestions } from "./hooks/useFetchQuestions.jsx";
import { createLeatherBoard } from "./services/apiLeatherboard.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function App() {
  const {
    status,
    index,
    answer,
    numberOfQuestions,
    dispatch,
    username,
    selectedQuestions,
    points,
    maxPoints,
    secondsRemaining,
    difficulty,
    restartQuiz,
  } = useQuiz();
  const [showTable, setShowTable] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [explosion, setExplosion] = useState(false);
  const { isLoading, error } = useFetchQuestions();
  const { data } = useQuery({
    queryKey: ["leatherboards"],
    queryFn: getLeatherBoards,
    onSuccess: () => {},
    onError: (error) => {
      console.error(error);
    },
  });

  const calculateTimeBasedOnDifficulty = () => {
    if (difficulty === "easy") {
      return 30;
    } else if (difficulty === "medium") {
      return 20;
    } else {
      return 15;
    }
  };

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

  useEffect(() => {
    logOut();
  }, []);

  const handleFinishBtn = () => {
    dispatch({ type: "finished" });
    setExplosion(true);
    mutate(LeaderBoardData);
  };

  const handleLeaveQuiz = () => {
    dispatch({ type: "restart" });
    restartQuiz();
  };

  return (
    <div className="app">
      {explosion && <ConfettiExplosion height={"120vh"} particleCount={170} duration={2500} />}
      {showLoginForm && (
        <Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setShowLoginForm={setShowLoginForm} />
      )}
      {showQuestionForm && <AddQuestion setShowQuestionForm={setShowQuestionForm} />}
      <Toaster position="top-center" containerStyle={{ fontSize: ".9rem", top: "4rem" }} />
      {status === "active" ? (
        <div className=" mt-[12vh]"></div>
      ) : (
        <Header
          setShowTable={setShowTable}
          setShowLoginForm={setShowLoginForm}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          setShowQuestionForm={setShowQuestionForm}
        />
      )}
      {status === "active" || showTable === false ? null : (
        <>
          <div className="overlay"></div>
          <div className="leaderBoardTable w-[96%] lg:w-full overflow-x-auto    ">
            <IoMdClose
              onClick={() => setShowTable(false)}
              size={30}
              style={{ cursor: "pointer", position: "absolute", top: "10px", right: "10px" }}
            />
            <LeaderBoaardTable data={data} isLoggedIn={isLoggedIn} />
          </div>
        </>
      )}

      <main className="main">
        {isLoading && <Loader />}
        {error && <Error />}
        {status === "ready" && <StartScreen />}
        {status === "active" && (
          <>
            <Progress />
            <Question />
            <footer className=" mt-6 flex  justify-between items-center  flex-col gap-5  lg:flex-row ">
              <Timer />
              <div className=" flex gap-5 flex-col lg:flex-row  w-full lg:w-auto ">
                {answer !== null && index < numberOfQuestions - 1 && (
                  <button className="neoBtn !px-6      " onClick={() => dispatch({ type: "nextQuestion" })}>
                    Next
                  </button>
                )}
                {answer !== null && index === numberOfQuestions - 1 && (
                  <button className="neoBtn !px-6" onClick={handleFinishBtn}>
                    Finish
                  </button>
                )}
                <button className="neoBtn !px-6" onClick={handleLeaveQuiz}>
                  Leave
                </button>
              </div>
            </footer>
          </>
        )}
        {status === "finished" && <FinishScreen setExplosion={setExplosion} />}
      </main>
    </div>
  );
}

export default App;
