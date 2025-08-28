import { NavLink } from "react-router-dom";

export const Header = () => {
    return (
        <header className="bg-blue-400 text-white shadow-md">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="text-xl font-bold">RecipeForge</div>
                <nav className="flex h-full">
                    <NavLink to="/" 
                        className={({isActive}) => 
                            `flex items-center p-4 h-full font-bold transition-colors ${
                                isActive 
                                ? "bg-blue-600 text-white" 
                                : "bg-blue-400 text-white hover:bg-blue-500"
                            }`
                        }
                    >
                        首页
                    </NavLink>
                    <NavLink to="/items" 
                        className={({isActive}) => 
                            `flex items-center p-4 h-full font-bold transition-colors ${
                                isActive 
                                ? "bg-blue-600 text-white" 
                                : "bg-blue-400 text-white hover:bg-blue-500"
                            }`
                        }
                    >
                        物品
                    </NavLink>
                    <NavLink to="/recipes" 
                        className={({isActive}) => 
                            `flex items-center p-4 h-full font-bold transition-colors ${
                                isActive 
                                ? "bg-blue-600 text-white" 
                                : "bg-blue-400 text-white hover:bg-blue-500"
                            }`
                        }
                    >
                        配方
                    </NavLink>
                    <NavLink to="/orders" 
                        className={({isActive}) => 
                            `flex items-center p-4 h-full font-bold transition-colors ${
                                isActive 
                                ? "bg-blue-600 text-white" 
                                : "bg-blue-400 text-white hover:bg-blue-500"
                            }`
                        }
                    >
                        订单
                    </NavLink>
                </nav>
            </div>
        </header>
    );
};