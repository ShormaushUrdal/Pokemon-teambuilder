import Statsbox from "./Statsbox";
import Smogonbox from "./Smogonbox";

export default function Welcomebox() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-white border-b border-indigo-400 pb-3">
                Welcome to Competitive Pokémon
            </h1>
            
            <p className="text-1xl text-white mb-6">
                Competitive Pokémon is a game of information and strategy. Unlike the main playthrough, winning in a competitive setting (like the Smogon formats) requires a deep knowledge of your Pokémon's movesets, strategies and the possible attacks that the opposing Pokémon 
                can inflict.
            </p>

            <div className="flex text-center">
                <div className="bg-indigo-800 p-4 rounded-md flex-auto">
                    <Statsbox/>
                </div>

                <div className="bg-indigo-800 p-4 rounded-md flex-auto">
                   <Smogonbox/>
                </div>
            </div>

            <footer className="mt-8 pt-4 border-t border-indigo-400 text-md italic">
                Pro Tip: Always account for Entry Hazards like Stealth Rock. In 6v6 singles, switching and stalling
                is frequent, and chip damage adds up quickly!
            </footer>
        </div>
    );
}