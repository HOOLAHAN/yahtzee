// Menu.tsx

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed left-0 top-0 z-40 h-full w-64 bg-white shadow-lg transform transition-transform duration-300`}>
      {/* Drawer content */}
      <div className="p-4">
        <h2 className="font-semibold text-lg">Menu</h2>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Close Drawer</button>
      </div>
    </div>
  );
};

export default Menu;