import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { createQuestion } from "../services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function AddQuestion({ setShowQuestionForm }) {
  const [form, setForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctOption: "",
    points: 10,
  });

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: createQuestion,
    onSuccess: () => {
      toast.success("Question added successfully");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Question wasn't added successfully");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.question ||
      !form.options.some((option) => option !== "") ||
      form.correctOption === null ||
      !form.points
    ) {
      return;
    }
    mutate(form);
    setForm({
      question: "",
      options: ["", "", "", ""],
      correctOption: "",
      points: "",
    });
  };

  return (
    <>
      <div className="overlay"></div>
      <div className="  questionForm">
        <IoMdClose
          size={30}
          style={{ cursor: "pointer", position: "absolute", top: "10px", right: "10px" }}
          onClick={() => setShowQuestionForm(false)}
        />
        <form action="" onSubmit={handleSubmit}>
          <h4>Add a Question</h4>
          <textarea
            placeholder="Enter the Question"
            cols="20"
            rows="5"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
          ></textarea>

          {form.options.map((option, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => {
                const newOptions = [...form.options];
                newOptions[index] = e.target.value;
                setForm({ ...form, options: newOptions });
              }}
            />
          ))}

          <input
            type="number"
            placeholder="Enter the Correct Option"
            value={form.correctOption}
            min={0}
            max={3}
            onChange={(e) => setForm({ ...form, correctOption: parseInt(e.target.value) })}
          />
          <input
            type="number"
            placeholder="Enter the Points for this question"
            value={form.points}
            min={10}
            max={30}
            onChange={(e) => setForm({ ...form, points: parseInt(e.target.value) })}
          />

          <button type="submit" disabled={isLoading}>
            {" "}
            {isLoading ? "Adding..." : "Add Question"}
          </button>
        </form>
      </div>
    </>
  );
}

export default AddQuestion;
