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

function App() {
  const { status, index, answer, numberOfQuestions, dispatch } = useQuiz();
  const [showTable, setShowTable] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { data } = useQuery({
    queryKey: ["leatherboards"],
    queryFn: getLeatherBoards,
    onSuccess: () => {},
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    localStorage.removeItem("sb-yiddftpjhsmxswosuqxw-auth-token");
  }, []);

  return (
    <div className="app">
      {showLoginForm && (
        <Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setShowLoginForm={setShowLoginForm} />
      )}
      {showQuestionForm && <AddQuestion setShowQuestionForm={setShowQuestionForm} />}
      <Toaster position="top-center" containerStyle={{ fontSize: "1.8rem", top: "5rem" }} />
      <Header
        setShowTable={setShowTable}
        setShowLoginForm={setShowLoginForm}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setShowQuestionForm={setShowQuestionForm}
      />
      {status === "active" || showTable === false ? null : (
        <>
          <div className="overlay"></div>
          <div className="leaderBoardTable ">
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
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen />}
        {status === "active" && (
          <>
            <Progress />
            <Question />
            <footer>
              <Timer />
              {answer !== null && index < numberOfQuestions - 1 && (
                <button className="btn btn-ui" onClick={() => dispatch({ type: "nextQuestion" })}>
                  Next
                </button>
              )}
              {answer !== null && index === numberOfQuestions - 1 && (
                <button className="btn btn-ui" onClick={() => dispatch({ type: "finished" })}>
                  Finish
                </button>
              )}
            </footer>
          </>
        )}
        {status === "finished" && <FinishScreen />}
      </main>
    </div>
  );
}

export default App;