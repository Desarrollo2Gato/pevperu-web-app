type btnsFormProps = {
  text?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  primary?: boolean;
};

const ButtonForm: React.FC<btnsFormProps> = ({
  text,
  onClick,
  type = "button",
  primary = false,
}) => {
  return primary ? (
    <button
      className="bg-green-800 border-2 border-green-800 text-white rounded-md px-4 py-1 text-center capitalize hover:bg-green-950 hover:border-green-950 transition-all duration-500"
      onClick={onClick}
      type={type}
    >
      {text}
    </button>
  ) : (
    <button
      className="border-2 border-green-800 rounded-md px-4 py-1 text-center text-green-800 font-semibold capitalize hover:bg-green-950 hover:border-green-950 hover:text-white transition-all duration-500"
      onClick={onClick}
      type={type}
    >
      {text}
    </button>
  );
};

export default ButtonForm;
