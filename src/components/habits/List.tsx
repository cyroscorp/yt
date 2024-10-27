import { IconCirclePlus } from "@tabler/icons-react";
import Item from "./Item";
import Modal from "../Modal";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createHabit } from "../../api/habit";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../api/firebase";
import { getCurrentDate } from "../../lib/date";

export default function List({ habits, setHabits }: { habits: Habit[]; setHabits: (val: any) => void }) {
    const [open, setOpen] = useState(false);
    const [user] = useAuthState(auth);

    const today = getCurrentDate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<HabitForm>({});

    const handleAddHabit = async (data: HabitForm) => {
        if (user) {
            const newHabit = await createHabit(user.uid, data);
            if (newHabit) {
                setHabits((prev: Habit[]) => [...prev, newHabit]);
            } else {
                console.error("Error creating habit");
            }
        } else {
            setHabits((prev: Habit[]) => [
                ...prev,
                {
                    id: prev.length,
                    color: data.color,
                    title: data.title,
                    active: true,
                    history: { [today]: { goalNumber: data.goalNumber, goalUnit: data.goalUnit, progress: 0 } },
                },
            ]);
        }
        setOpen(false);
    };

    function renderItems() {
        return habits.map((habit) => {
            if (habit.active) {
                return <Item key={habit.id} habit={habit} setHabits={setHabits} />;
            }
        });
    }

    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">Your Habits</h3>
            <hr className="mb-6" />
            <div className="space-y-4">{renderItems()}</div>

            <button
                onClick={() => {
                    reset();
                    setOpen(true);
                }}
                className="flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-gradient-to-l transition-all duration-300 transform hover:scale-105"
            >
                <IconCirclePlus className="mr-2" />
                <span className="font-semibold">Add Habit</span>
            </button>

            <Modal open={open} setOpen={setOpen} title={"Add New Habit"}>
                <form onSubmit={handleSubmit(handleAddHabit)} className="space-y-6">
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Habit Title"
                            {...register("title", { required: "Habit Title is required", minLength: 2 })}
                            className="p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>

                    <div className="flex space-x-4">
                        <div className="flex-1 space-y-2">
                            <input
                                type="number"
                                placeholder="Goal Number"
                                {...register("goalNumber", { required: "Goal Number is required", min: 1 })}
                                className="p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.goalNumber && (
                                <p className="text-red-500 text-sm">{errors.goalNumber.message}</p>
                            )}
                        </div>

                        <div className="flex-1 space-y-2">
                            <input
                                type="text"
                                placeholder="Goal Unit (e.g., Minutes)"
                                {...register("goalUnit", { required: "Goal Units are required", minLength: 1 })}
                                className="p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.goalUnit && (
                                <p className="text-red-500 text-sm">{errors.goalUnit.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            onClick={() => setOpen(false)}
                            type="button"
                            className="text-gray-600 hover:text-gray-800"
                        >
                            <p className="font-semibold">Cancel</p>
                        </button>
                        <button className="bg-gradient-to-r from-purple-500 to-purple-700 text-white drop-shadow-md py-2 px-4 rounded-lg hover:bg-gradient-to-l transition-colors duration-300">
                            <p className="font-semibold">Add</p>
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
