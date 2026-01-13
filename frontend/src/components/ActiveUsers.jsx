

const ActiveUsers = ({ users = [] }) => {

  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#8B5CF6', // purple
    '#F59E0B', // amber
    '#EF4444', // red
    '#EC4899', // pink
  ];

  const getColor = (userId) => {
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };


  const visibleUsers = users.slice(0, 5);
  const remainingCount = users.length - 5;

  if (users.length === 0) return null;

  return (
    <div className="flex items-center">
      {visibleUsers.map((user, index) => (
        <div
          key={user.id}
          title={user.name}
          style={{ backgroundColor: getColor(user.id) }}
          className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold border-2 border-background shadow-sm
            ${index > 0 ? '-ml-2' : ''} 
            hover:scale-110 hover:z-10 transition-transform cursor-default relative`}
        >
          {user.name?.charAt(0).toUpperCase() || '?'}
        </div>
      ))}

      {remainingCount > 0 && (
        <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold -ml-2 border-2 border-background shadow-sm">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default ActiveUsers;
