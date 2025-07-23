import React from 'react';
import './index.css';

const MaterialRequirement = ({ materials }) => {
  if (!materials || materials.length === 0) {
    return (
      <div className="material-requirement">
        <h2>材料需求</h2>
        <p className="no-materials">暂无材料需求</p>
      </div>
    );
  }

  return (
    <div className="material-requirement">
      <h2>材料需求清单</h2>
      <ul>
        {materials.map((material, index) => (
          <li 
            key={index} 
            className={`material-item ${material.sufficient ? 'sufficient' : 'insufficient'}`}
          >
            <div className="material-info">
              <span className="material-name">{material.name}</span>
              <div className="material-quantities">
                <span className="required">需要: {material.required}</span>
                <span className="available">库存: {material.available}</span>
                <span className={`status ${material.sufficient ? 'sufficient' : 'insufficient'}`}>
                  {material.sufficient ? '✓ 充足' : '✗ 不足'}
                </span>
              </div>
            </div>
            <div className="material-progress">
              <div 
                className="progress-bar"
                style={{ 
                  width: `${Math.min((material.available / material.required) * 100, 100)}%`,
                  backgroundColor: material.sufficient ? '#10b981' : '#ef4444'
                }}
              ></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MaterialRequirement;