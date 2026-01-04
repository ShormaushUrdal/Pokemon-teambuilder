import { LoginForm } from "../../auth/Login"
import { useAuth} from "../../auth/Authcontext"
import { Link } from "react-router";
import { SignupForm } from "../../auth/Signupform";
export default function Loginbox() {
    const { isAuthenticated, user, loading, logout } = useAuth();
    if (loading) return null;

    return (
        <div className="max-w-2xl mt-10">
            <div className="text-lg p-6 m-3 text-slate-200 bg-slate-800 rounded-xl border border-slate-700">
                <p>
                    This is a <span className="text-cyan-400 font-bold">Pokémon Teambuilder</span> for Single battles format! 
                    In this format, each player has a maximum of 6 Pokémon, each with a moveset of 4, an ability, and a Held Item.
                    Objective: Make all of the opponent's Pokémon faint. Manage, save, and share your teams with ease.
                </p>
            </div>
            
            <br/>

            {isAuthenticated ? (
                <div className="p-6 m-3 bg-slate-800 rounded-xl border border-green-500 text-center">
                    <h2 className="text-white text-xl mb-4">Welcome back, {user?.display}!</h2>
                    <div className="flex gap-4 justify-center">
                        <Link 
                            to="/teambuilder" 
                            className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded"
                        >
                            My Teams
                        </Link>
                        <button 
                            type = "button"
                            onClick={(e) => {
                                e.preventDefault();
                                logout();
                            }}
                            className="cursor-pointer bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded">
                            Logout
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <LoginForm />
                    <SignupForm/>
                </>
               
            )}
        </div>
    );
}