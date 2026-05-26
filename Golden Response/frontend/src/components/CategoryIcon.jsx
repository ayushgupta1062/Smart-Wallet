import React from 'react';
import * as Icons from 'lucide-react';

const CategoryIcon = ({ name, size = 16, className = '' }) => {
  // Resolve Lucide component from string label or fallback to HelpCircle
  const IconComponent = Icons[name] || Icons.HelpCircle;
  return <IconComponent size={size} className={className} />;
};

export default CategoryIcon;
