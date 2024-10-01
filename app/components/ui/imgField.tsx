import { Box, Modal } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FieldError } from "react-hook-form";
import { FaRegImage } from "react-icons/fa6";

type ImgFieldProps = {
  id: string;
  imgLogo: string;
  register: any;
  error?: FieldError;
  watch: any;
  setImgLogo: (img: string) => void;
  iscategory?: boolean;
  isPost?: boolean;
  alt?: string;
};
export const ImgField: React.FC<ImgFieldProps> = ({
  id,
  imgLogo,
  register,
  error,
  watch,
  setImgLogo,
  iscategory,
  isPost,
  alt,
}) => {
  const [modal, setModal] = useState(false);
  useEffect(() => {
    if (watch) {
      const file = watch;
      if (file === null) return;
      const imgUrl = URL.createObjectURL(file[0]);
      setImgLogo(imgUrl);
      console.log(watch);
    }
  }, [watch]);

  const [imageSize, setImageSize] = useState({ width: 100, height: 100 });

  useEffect(() => {
    if (imgLogo) {
      const img = new window.Image();
      img.src = imgLogo;

      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
      };
    }
  }, [imgLogo]);

  const handleShowImg = () => {
    setModal(true);
  };
  return (
    <div className="flex flex-col gap-2 items-center">
      {imgLogo ? (
        <div className="relative">
          <Image
            onClick={handleShowImg}
            role="button"
            priority
            src={imgLogo}
            width={imageSize.width}
            height={imageSize.height}
            alt={alt || "Imagen"}
            className={`rounded-md ${
              isPost
                ? "min-h-32 min-w-44 max-h-32 max-w-44"
                : "min-h-24 min-w-24 max-h-24 max-w-24"
            } border border-zinc-200 ${
              iscategory ? "object-contain" : "object-cover"
            } `}
          />
          <label
            htmlFor={id}
            className="w-8 h-8 absolute -bottom-2 -right-2 rounded-full bg-green-800 flex justify-center items-center z-10 shadow-md cursor-pointer "
          >
            <FaRegImage className="text-zinc-200 text-lg " />
            <input
              id={id}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
              {...register}
            />
          </label>
        </div>
      ) : (
        <div
          className={`border-2 border-zinc-200 rounded-md ${
            isPost ? "h-32 w-44" : "h-24 w-24"
          } flex justify-center items-center relative`}
        >
          <FaRegImage className="text-zinc-200 text-4xl" />
          <label
            htmlFor={id}
            className="w-8 h-8 absolute -bottom-2 -right-2 rounded-full bg-green-800 flex justify-center items-center z-10 shadow-md cursor-pointer "
          >
            <FaRegImage className="text-zinc-200 text-lg " />
            <input
              id={id}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
              {...register}
            />
          </label>
        </div>
      )}
      {error && <div className="text-red-500 text-sm">{error.message}</div>}
      <Modal open={modal} onClose={() => setModal(false)}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-auto">
          <Image
            src={imgLogo}
            priority
            width={imageSize.width}
            height={imageSize.height}
            alt={alt || "Imagen"}
            className="w-full h-full max-w-[95vw] max-h-[90vh] object-contain"
          />
        </Box>
      </Modal>
    </div>
  );
};
