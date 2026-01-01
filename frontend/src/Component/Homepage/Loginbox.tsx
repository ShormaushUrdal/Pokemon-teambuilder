import Loggedoutbox from "./Loggedoutbox";
export default function Loginbox() {
    return (
        <div className="max-w-2xl mt-10">
            <div className="text-lg p-6 m-3 text-slate-200 bg-slate-800 rounded-xl  border border-slate-700">
                <p>
                    This is a <span className="text-cyan-400 font-bold">Pokémon Teambuilder</span> for Single battles format! 
                    In this format, each player has a maximum of 6 Pokémon, each with a moveset of 4, an ability, and a Held Item. 
                    Objective: Make all of the opponent's Pokémon faint. Manage, save, and share your teams with ease.
                </p>
            </div>
            <br />
            <Loggedoutbox/>
        </div>
    );
}