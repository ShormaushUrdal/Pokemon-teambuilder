export default function Statsbox() {
    return  (
        <div className = "text-white p-2">
            There are several Pokémons with its own unique advantages and disadvantages. Each Pokémon has a set of 6 stats, a slot for holding item, and an ability. There are several types, type matchups, natures and other mechanics like EVs, IVs that you need to keep in mind. Check out this website for looking up any stats! 
            <br/> <br/>
            <a 
                href = "https://bulbapedia.bulbagarden.net/wiki/Browse:Pok%C3%A9dex"
                target = "_blank"
                className = "bg-blue-500 border-2 border-indigo-950 rounded-sm p-3 hover:text-pink-300 hover:bg-indigo-950 hover:text-lg"            
            >
                BULBAPEDIA OFFICIAL WEBSITE
            </a>           
        </div>
        
    )
}