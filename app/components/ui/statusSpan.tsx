import { IoMdAdd } from "react-icons/io";

type StatusSpanProps = {
  text: string;
  bg?: string;
  color?: string;
};
const StatusSpan: React.FC<StatusSpanProps> = ({
  text,
  bg = "bg-green-400",
  color = "text-slate-100",
}) => {
  return (
    <span className={` px-2 py-0.5 rounded-lg ${bg} ${color} text-xs font-medium `}>
      {text}
    </span>
  );
};

export default StatusSpan;
