export default function Header() {
    return (
        <>
            <div className="flex">
                <h1 className="text-white text-3xl text-center bg-blue-900 flex-3 p-5 m-2 rounded-md">
                    Teambuilder
                </h1>
                <a 
                    href = "/"
                    className="text-white flex-1 text-2xl p-4 border-sm bg-cyan-700 hover:bg-indigo-950 text-center m-4 rounded-md">
                    Home
                </a>
            </div>
            <a 
                href = "/edit_team"
                className="text-white bg-indigo-400 hover:bg-indigo-950 text-3xl flex auto justify-center p-4 m-4 rounded-sm">
                Build A New Team
            </a>
        </>
    )
}