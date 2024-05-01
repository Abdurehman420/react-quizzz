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
    <header className="app-header container mx-auto">
      <img src="./nabiSaw.jpg" alt="" className=" h-10 w-10" />
      <div className=" right">
        {isLoggedIn && <button onClick={() => setShowQuestionForm((prev) => !prev)}>Add a Question</button>}
        {isLoggedIn ? (
          <button onClick={() => mutate()} disabled={isPending}>
            {isPending ? "Logging out..." : "Logout"}
          </button>
        ) : (
          <button
            className=" shadow-neoButton border-2 border-black rounded-sm"
            onClick={() => setShowLoginForm((prev) => !prev)}
          >
            Login
          </button>
        )}
        <div
          className="  hover:text-black/80 cursor-pointer duration-200  "
          onClick={() => setShowTable((prev) => !prev)}
        >
          <MdLeaderboard size={35} />
        </div>
      </div>
    </header>
  );
}

export default Header;
