import { NavLink } from "react-router-dom";

export const Header = () =>{
    return(
        <header className="bg-blue-600 text-white-600 shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="text-xl font-bold">RecipeForge</div>
                <nav>
                    <NavLink to = "/" 
                    className={({isActive}) => isActive
                    ? "font-bold bg-blue-600 py-1 border-white-200"
                    : "font-bold bg-blue-400 py-1 transition-colors border-white-200"}   
                    >首页</NavLink>
                    <NavLink to = "/items" 
                    className={({isActive}) => isActive
                    ? "font-bold bg-blue-600 py-1 border-white-200"
                    : "font-bold bg-blue-400 py-1 transition-colors border-white-200"}   
                    >物品</NavLink>
                    <NavLink to = "/recipes" 
                    className={({isActive}) => isActive
                    ? "font-bold bg-blue-600 py-1 border-white-200"
                    : "font-bold bg-blue-400 py-1 transition-colors border-white-200"}   
                    >配方</NavLink>
                    <NavLink to = "/orders" 
                    className={({isActive}) => isActive
                    ? "font-bold bg-blue-600 py-1 border-white-200"
                    : "font-bold bg-blue-400 py-1 transition-colors border-white-200"}   
                    >订单</NavLink>
                </nav>
            </div>
        </header>
    )
}