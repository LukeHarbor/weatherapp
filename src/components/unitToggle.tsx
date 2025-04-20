import React from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleUnit } from './weatherSlice';
import type { RootState } from '../app/store';

const UnitToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const unit = useAppSelector((state: RootState) => state.weather.unit);

  const handleToggle = () => {
    dispatch(toggleUnit());
  };

  return (
    <div className="switch-wrap">
      <label className="switch">
        <input
          type="checkbox"
          checked={unit === 'F'}
          onChange={handleToggle}
        />
        <span className="slider" />
        <span className="labels">
          <span>°C</span>
          <span>°F</span>
        </span>
      </label>
    </div>
  );
};

export default UnitToggle;
