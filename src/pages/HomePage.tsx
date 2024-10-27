import { useEffect, useState } from "react";
import List from "../components/habits/List";
import { getAllHabits } from "../api/habit";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../api/firebase";
import Nav from "../components/Nav";
import Chart from "../components/chart/Chart";
import Me from "./x/Me";
import Chat from "./Chat";
import Blog from "./Blog";
import W from "./wisdom";
import Note from "../a/Note";
import Test from "./now";

export default function HomePage() {
    const [user] = useAuthState(auth);
    const [habits, setHabits] = useState<Habit[]>([]);

    useEffect(() => {
        async function populateHabits() {
            if (user) {
                const data = await getAllHabits(user.uid);
                console.log("habits: ", data);
                setHabits(data);
            }
        }
        populateHabits();
    }, [user]);

    return (<>
    
        <div className="space-y-2">
            <Nav />
            <Chart habits={habits} />
            <Me/>
            <List habits={habits} setHabits={setHabits} />
            <Chat/>
            <Blog/>
            <W/>
            <Note/>
            <Test/>
            
        </div>
        </>
    );
}
