import { IoMdAdd } from "react-icons/io";

type AddButtonProps = {
  text?: string;
  onClick?: () => void;
};
const AddButton: React.FC<AddButtonProps> = ({ text = "Agregar", onClick }) => {
  return (
    <button
      className="bg-green-800 hover:bg-green-950 text-white text-sm rounded-md px-3 py-1.5 flex flex-row items-center gap-1 transition-all duration-500"
      onClick={onClick}
    >
      <IoMdAdd className="text-white" /> {text}
    </button>
  );
};

export default AddButton;
