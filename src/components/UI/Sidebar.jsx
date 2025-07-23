import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2>配方管理工具</h2>
      <nav>
        <ul>
          <li>
            <Link to="/recipes">配方列表</Link>
          </li>
          <li>
            <Link to="/inventory">库存管理</Link>
          </li>
          <li>
            <Link to="/calculator">合成计算器</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;