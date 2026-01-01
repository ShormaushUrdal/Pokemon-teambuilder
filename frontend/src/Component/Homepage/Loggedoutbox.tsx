export default function Loggedoutbox() {
    return (
        <div className="m-3 p-8 bg-cyan-900 border border-cyan-700 rounded-2xl shadow-2xl text-center">
                <h2 className="text-white text-2xl font-semibold mb-6">
                    Ready to build your team?
                </h2>
                <p className="text-cyan-100 mb-8 text-md">
                    Please login to view and edit your Pokémon teams!
                </p>
                <a 
                    href="/login" 
                    className="inline-block m-2 p-4 bg-red-500 hover:bg-red-800 text-white text-xl font-bold rounded-full transform hover:-translate-y-1"
                >
                    Login
                </a>
        </div>
    )
}