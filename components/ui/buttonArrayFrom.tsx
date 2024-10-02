type btnsFormProps = {
  text?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  isDelete?: boolean;
};

const ButtonArrayForm: React.FC<btnsFormProps> = ({
  text,
  onClick,
  type = "button",
  isDelete = false,
}) => {
  return isDelete ? (
    <button
      className="border-red-400 border text-red-400 text-sm font-medium rounded-md py-1 px-6 hover:bg-red-400 hover:text-white transition-all duration-500"
      onClick={onClick}
      type={type}
    >
      {text}
    </button>
  ) : (
    <button
      className="border-blue-500 border text-blue-500 text-sm font-medium py-1 px-6 rounded-md transition-all duration-500 hover:bg-blue-500 hover:text-white self-end"
      onClick={onClick}
      type={type}
    >
      {text}
    </button>
  );
};

export default ButtonArrayForm;
