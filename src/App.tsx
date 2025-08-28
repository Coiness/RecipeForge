import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Suspense, lazy } from "react"
import MainLayout from "./layout/MainLayout"

// 使用 lazy 懒加载页面组件
// const Dashboard = lazy(() => import("./pages/Dashboard"))
const ItemPage = lazy(() => import("./pages/ItemPage"))
// const RecipePage = lazy(() => import("./pages/RecipePage"))
// const CalculatorPage = lazy(() => import("./pages/CalculatorPage"))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">加载中...</div>}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="items" element={<ItemPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App