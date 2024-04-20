import { MdLeaderboard } from "react-icons/md";
import { logOut } from "../services/apiAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function Header({ setShowTable, setShowLoginForm, isLoggedIn, setIsLoggedIn, setShowQuestionForm }) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      queryClient.removeQueries();
      console.log("logged out successfully");
      setIsLoggedIn(false);
      setShowLoginForm(false);
      toast.success("logged out successfully");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <header className="app-header">
      <h1 className=" "> React Quiz</h1>
      <div className=" right">
        {isLoggedIn && <button onClick={() => setShowQuestionForm((prev) => !prev)}>Add a Question</button>}
        {isLoggedIn ? (
          <button onClick={() => mutate()} disabled={isPending}>
            {isPending ? "Logging out..." : "Logout"}
          </button>
        ) : (
          <button onClick={() => setShowLoginForm((prev) => !prev)}>Login</button>
        )}
        <div className="leaderBoardBtn  " onClick={() => setShowTable((prev) => !prev)}>
          <MdLeaderboard size={30} />
        </div>
      </div>
    </header>
  );
}

export default Header;
