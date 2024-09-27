import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  title?: string;
};

export const MainContainer: React.FC<ContainerProps> = ({
  children,
  title,
}) => {
  return (
    <div className="bg-white rounded-xl w-full p-4 md:p-6 lg:p-8">
      {title && <h2 className="font-medium mb-4 text-lg">{title}</h2>}
      {children}
    </div>
  );
};

export const SafeAreaContainer: React.FC<{
  children: ReactNode;
  isTable?: boolean;
}> = ({ children, isTable = false }) => {
  return (
    <div
      className={`${
        isTable ? "max-w-[1400px]" : "max-w-[1024px]"
      } mx-auto text-zinc-600`}
    >
      {children}
    </div>
  );
};
