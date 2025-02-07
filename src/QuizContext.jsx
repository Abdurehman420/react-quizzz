import { createContext, useContext, useEffect, useReducer, useState } from "react";

import { useFetchQuestions } from "./hooks/useFetchQuestions";

const QuizContext = createContext();

function QuizProvider({ children }) {
  const initialState = {
    username: "",
    questions: [],
    status: "loading",
    index: 0,
    answer: null,
    points: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    secondsRemaining: null,
    difficulty: "medium",
  };
  const [key, setKey] = useState(0);
  const { data, error } = useFetchQuestions();

  useEffect(() => {
    if (!data) return;

    const shuffledData = data
      .map((question) => ({
        ...question,
        options: [...question.options],
      }))
      .sort(() => Math.random() - 0.5);
    dispatch({ type: "dataReceived", payload: shuffledData });
    if (error) {
      dispatch({ type: "dataFailed" });
    }
  }, [data, error, key]);

  const restartQuiz = () => {
    dispatch({ type: "restart" });
    setKey((prevKey) => prevKey + 1);
  };

  function reducer(state, action) {
    const quesion = state.questions[state.index];

    switch (action.type) {
      case "dataReceived":
        return { ...state, questions: action.payload, status: "ready" };
      case "dataFailed":
        return { ...state, status: "error" };
      case "setUsername":
        return { ...state, username: action.payload };
      case "start": {
        let timeLimitInSeconds;
        switch (state.difficulty) {
          case "easy":
            timeLimitInSeconds = action.payload * 30;
            break;
          case "medium":
            timeLimitInSeconds = action.payload * 20;
            break;
          case "hard":
            timeLimitInSeconds = action.payload * 15;
            break;

          default:
            timeLimitInSeconds = action.payload * 20;
        }
        return {
          ...state,
          status: "active",
          secondsRemaining: timeLimitInSeconds,
          questions: state.questions.slice(0, action.payload),
        };
      }
      case "newAnswer":
        return {
          ...state,
          answer: action.payload,
          points: action.payload === quesion.correctOption ? state.points + quesion.points : state.points,
          correctAnswers: action.payload === quesion.correctOption ? state.correctAnswers + 1 : state.correctAnswers,
          wrongAnswers: action.payload !== quesion.correctOption ? state.wrongAnswers + 1 : state.wrongAnswers,
        };
      case "nextQuestion":
        return {
          ...state,
          index: state.index + 1,
          answer: null,
        };
      case "finished":
        return { ...state, status: "finished" };
      case "restart":
        return {
          ...initialState,

          status: "ready",
        };
      case "tick":
        return {
          ...state,
          secondsRemaining: state.secondsRemaining - 1,
          status: state.secondsRemaining === 0 ? "finished" : state.status,
        };

      case "setDifficulty":
        return { ...state, difficulty: action.payload };

      default:
        throw new Error("Unknown action");
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    questions,
    status,
    index,
    answer,
    points,
    correctAnswers,
    wrongAnswers,
    secondsRemaining,
    username,
    difficulty,
  } = state;
  const question = questions[index];
  const numberOfQuestions = questions.length;

  const [selectedQuestions, setSelectedQuestions] = useState(numberOfQuestions);

  const maxPoints = questions.reduce((prev, curr) => prev + curr.points, 0);

  return (
    <QuizContext.Provider
      value={{
        username,
        questions,
        status,
        index,
        answer,
        points,
        correctAnswers,
        wrongAnswers,
        secondsRemaining,
        dispatch,
        maxPoints,
        numberOfQuestions,
        selectedQuestions,
        setSelectedQuestions,
        question,
        difficulty,
        restartQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}

export { QuizProvider, useQuiz };
