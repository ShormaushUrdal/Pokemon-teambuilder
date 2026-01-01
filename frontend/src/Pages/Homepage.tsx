
import Loginbox from "../Component/Homepage/Loginbox";
import Welcomebox from "../Component/Homepage/Welcomebox";

export default function Homepage() {
    return(
        <div className = "flex m-6 p-4">
            <div className = "bg-indigo-950 rounded-lg overflow-hidden text-blue-200 max-w-3xl border-2 m-4 p-2 w-120 grow basis-0">
                <Loginbox></Loginbox>
            </div>
             <div className = "bg-indigo-950 rounded-lg overflow-hidden text-blue-200 max-w-5xl  border-2 m-4 p-2 grow-[2] basis-0">
                <Welcomebox></Welcomebox>
            </div>
        </div>
    )
}