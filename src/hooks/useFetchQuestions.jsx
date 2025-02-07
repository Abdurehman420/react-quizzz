import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getQuestions } from "../services/apiQuestions";

export const useFetchQuestions = () => {
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery({
    queryKey: ["questions"],
    queryFn: getQuestions,
    onSuccess: () => {
      queryClient.invalidateQueries(["questions"]);
    },
  });

  return { data, error, isLoading };
};
