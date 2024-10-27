import { IconDots } from "@tabler/icons-react";
import { useState } from "react";
import Modal from "../Modal";
import { useForm } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import { deleteHabit, updateHabit, updateHistory } from "../../api/habit";
import { getCurrentDate } from "../../lib/date";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../api/firebase";

const today = getCurrentDate();

export default function Item({ habit, setHabits }: { habit: Habit; setHabits: (val: any) => void }) {
    const [editOpen, setEditOpen] = useState(false);
    const [removeOpen, setRemoveOpen] = useState(false);
    const [user] = useAuthState(auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<HabitForm>({
        defaultValues: {
            title: habit.title,
            goalNumber: habit.history[today].goalNumber,
            goalUnit: habit.history[today].goalUnit,
            color: habit.color,
        },
    });

    const handleSetProgress = async (progress: number) => {
        if (user) {
            await updateHistory(habit.id, today, { progress });
        }
        setHabits((prevHabits: Habit[]) => {
            return prevHabits.map((prevHabit) => {
                if (prevHabit.id === habit.id) {
                    return {
                        ...prevHabit,
                        history: {
                            ...prevHabit.history,
                            [today]: {
                                ...prevHabit.history[today],
                                progress,
                            },
                        },
                    };
                }
                return prevHabit;
            });
        });
    };

    const handleEditHabit = async (data: HabitForm) => {
        if (user) {
            await updateHabit(habit.id, { title: data.title, color: data.color });
            await updateHistory(habit.id, today, { goalNumber: data.goalNumber, goalUnit: data.goalUnit });
        }
        setHabits((prevHabits: Habit[]) =>
            prevHabits.map((prevHabit) =>
                prevHabit.id === habit.id
                    ? {
                          ...prevHabit,
                          title: data.title,
                          color: data.color,
                          history: {
                              ...prevHabit.history,
                              [today]: {
                                  ...prevHabit.history[today],
                                  goalNumber: data.goalNumber,
                                  goalUnit: data.goalUnit,
                              },
                          },
                      }
                    : prevHabit
            )
        );
        setEditOpen(false);
    };

    const handleRetireHabit = async () => {
        if (user) {
            await updateHabit(habit.id, { active: false });
        }
        setHabits((prevHabits: Habit[]) =>
            prevHabits.map((prevHabit) =>
                prevHabit.id === habit.id
                    ? {
                          ...prevHabit,
                          active: false,
                      }
                    : prevHabit
            )
        );
        setRemoveOpen(false);
    };

    const handleDeleteHabit = async () => {
        if (user) {
            await deleteHabit(habit.id);
        }
        setHabits((prevHabits: Habit[]) => prevHabits.filter((prevHabit) => prevHabit.id !== habit.id));
        setRemoveOpen(false);
    };

    return (
        <div className="mb-4">
            <div className="bg-white dark:bg-gray-800 flex justify-between items-center p-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                <div className="flex items-center space-x-4">
                    <button
                        className={`rounded-full h-5 w-5 transition duration-300 ${
                            habit.history[today].progress >= habit.history[today].goalNumber
                                ? "bg-green-500"
                                : "border-2 border-blue-500"
                        }`}
                        onClick={() =>
                            handleSetProgress(
                                habit.history[today].progress >= habit.history[today].goalNumber
                                    ? 0
                                    : Number(habit.history[today].goalNumber)
                            )
                        }
                    />
                    <p className="text-gray-800 dark:text-white font-medium">{habit.title}</p>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleSetProgress(habit.history[today].progress - 1)}
                        className="bg-blue-500 text-white rounded-full px-3 py-1 transition duration-200 hover:bg-blue-600"
                    >
                        -
                    </button>
                    <p className="text-gray-700 dark:text-gray-300">
                        {habit.history[today].progress}/{habit.history[today].goalNumber}{" "}
                        {habit.history[today].goalUnit}
                    </p>
                    <button
                        onClick={() => handleSetProgress(habit.history[today].progress + 1)}
                        className="bg-blue-500 text-white rounded-full px-3 py-1 transition duration-200 hover:bg-blue-600"
                    >
                        +
                    </button>
                </div>

                <Popover placement="right-start">
                    <PopoverTrigger>
                        <IconDots className="h-6 w-6 text-gray-600 dark:text-gray-300 cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="Popover">
                        <div className="p-2 flex flex-col items-start bg-white dark:bg-gray-800 rounded-md shadow-md">
                            <button
                                onClick={() => setEditOpen(true)}
                                className="text-gray-800 dark:text-white hover:text-blue-500 transition duration-200"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => setRemoveOpen(true)}
                                className="text-gray-800 dark:text-white hover:text-red-500 transition duration-200"
                            >
                                Remove
                            </button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <Modal open={editOpen} setOpen={setEditOpen} title={"Edit Habit"}>
                <form onSubmit={handleSubmit(handleEditHabit)} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Habit Title"
                            {...register("title", { required: "Habit Title is required", minLength: 2 })}
                            className="p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>

                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <input
                                type="number"
                                placeholder="Goal Number"
                                {...register("goalNumber", { required: "Goal Number is required", min: 1 })}
                                className="p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.goalNumber && <p className="text-red-500 text-sm">{errors.goalNumber.message}</p>}
                        </div>

                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Goal Unit"
                                {...register("goalUnit", { required: "Goal Units are required", minLength: 1 })}
                                className="p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.goalUnit && <p className="text-red-500 text-sm">{errors.goalUnit.message}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            onClick={() => setEditOpen(false)}
                            type="button"
                            className="text-gray-600 hover:text-gray-800 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button className="bg-blue-600 text-white rounded-lg py-2 px-4 transition duration-300 hover:bg-blue-700">
                            Edit
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal open={removeOpen} setOpen={setRemoveOpen} title={"Remove Habit"}>
                <div className="max-w-md">
                    <p className="text-gray-800 dark:text-gray-300 mb-4">
                        Are you sure you want to delete this habit? Select delete to remove it permanently, or retire it to keep the data.
                    </p>
                    <div className="flex justify-end space-x-4">
                        <button onClick={() => setRemoveOpen(false)} type="button" className="text-gray-600 hover:text-gray-800 transition duration-200">
                            Cancel
                        </button>
                        <button
                            onClick={handleRetireHabit}
                            className="bg-yellow-500 text-white rounded-lg py-2 px-4 transition duration-300 hover:bg-yellow-600"
                        >
                            Retire
                        </button>
                        <button
                            onClick={handleDeleteHabit}
                            className="bg-red-500 text-white rounded-lg py-2 px-4 transition duration-300 hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
