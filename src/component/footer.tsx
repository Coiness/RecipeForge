import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-col space-y-2">
                    {/* 联系方式和项目地址 */}
                    <div className="flex flex-col md:flex-row md:justify-between">
                        <div className="space-y-2 mb-4 md:mb-0">
                            <div className="font-medium">作者: Coiness</div>
                            <div>QQ: 1512133221</div>
                            <div>
                                项目地址: 
                                <a 
                                    href="https://github.com/Coiness/RecipeForge" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="ml-2 text-blue-300 hover:text-blue-200 transition-colors"
                                >
                                    GitHub - RecipeForge
                                </a>
                            </div>
                        </div>
                        
                        {/* 快速链接 */}
                        <div className="space-y-2">
                            <div className="font-medium">快速链接</div>
                            <div className="flex space-x-4">
                                <Link to="/" className="text-blue-300 hover:text-blue-200 transition-colors">
                                    首页
                                </Link>
                                <Link to="/items" className="text-blue-300 hover:text-blue-200 transition-colors">
                                    物品
                                </Link>
                                <Link to="/recipes" className="text-blue-300 hover:text-blue-200 transition-colors">
                                    配方
                                </Link>
                                <Link to="/orders" className="text-blue-300 hover:text-blue-200 transition-colors">
                                    订单
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    {/* 分隔线 */}
                    <div className="border-t border-gray-600 my-4"></div>
                    
                    {/* 版权信息 */}
                    <div className="text-center text-gray-400 text-sm">
                        &copy; {currentYear} RecipeForge by Coiness. 保留所有权利。
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;