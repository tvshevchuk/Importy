import React, { memo, useState } from 'react';
import { Component } from 'react';

interface UserCardProps {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const UserCard: React.FC<UserCardProps> = memo(({ 
  id, 
  name, 
  email, 
  avatar, 
  onEdit, 
  onDelete 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleEdit = () => {
    onEdit?.(id);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      onDelete?.(id);
    }
  };

  return (
    <div 
      className={`user-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="user-avatar">
        {avatar ? (
          <img src={avatar} alt={`${name}'s avatar`} />
        ) : (
          <div className="avatar-placeholder">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <div className="user-info">
        <h3 className="user-name">{name}</h3>
        <p className="user-email">{email}</p>
      </div>
      
      <div className="user-actions">
        <button 
          className="edit-btn"
          onClick={handleEdit}
          aria-label={`Edit ${name}`}
        >
          Edit
        </button>
        <button 
          className="delete-btn"
          onClick={handleDelete}
          aria-label={`Delete ${name}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
});

UserCard.displayName = 'UserCard';

export default UserCard;