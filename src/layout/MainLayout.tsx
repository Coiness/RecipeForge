import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../component/header";
import { Footer } from "../component/footer";

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* 头部 */}
            <Header />
            
            {/* 主内容区域 - 自动伸展填充可用空间 */}
            <main className="flex-grow container mx-auto px-4 py-6">
                <Outlet />
            </main>
            
            {/* 页脚 */}
            <Footer />
        </div>
    );
};

export default MainLayout;