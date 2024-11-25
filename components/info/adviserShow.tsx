import { IAdviser } from "@/types/api";
import { apiUrls } from "@/utils/api/apiUrls";
import { imgUrl } from "@/utils/img/imgUrl";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ButtonArrayForm from "../ui/buttonArrayFrom";
import ButtonForm from "../ui/buttonForm";

type AdviserShowProps = {
  id: number;
  token: string;
  closeModal: () => void;
};

const AdviserShow: React.FC<AdviserShowProps> = ({ id, token, closeModal }) => {
  const [adviser, setAdviser] = useState<IAdviser>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrls.advisor.getOne(id.toString())}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data.data);
      setAdviser(res.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Ocurrio un error al obtener los datos");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto overflow-hidden">
      {/* Banner */}
      <div className="relative flex justify-center">
        {adviser?.banner_url ? (
          <img
            src={imgUrl(adviser?.banner_url)}
            alt="Banner"
            className="w-full h-32 object-cover"
          />
        ) : (
          <div className="w-full h-32 border border-zinc-200 rounded-md"></div>
        )}
        {adviser?.photo_url ? (
          <img
            src={imgUrl(adviser?.photo_url)}
            alt={`${adviser?.names} ${adviser?.last_names}`}
            className="absolute -bottom-8  w-24 h-24 rounded-full border-4 border-white object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full border border-zinc-200 absolute -bottom-8"></div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold">
            {adviser?.names} {adviser?.last_names}
          </h2>
          <p className="text-zinc-500">
            {adviser?.specialty} - {adviser?.nationality}
          </p>
          <p className="text-sm text-green-800 font-medium">
            {adviser?.availability}
          </p>
        </div>

        {/* Description */}
        <span>Descripción</span>
        <p className="text-zinc-700 mb-4">{adviser?.description}</p>

        {/* Education & Experience */}
        <div className="mb-4">
          <h3 className="text-lg font-medium">Educación</h3>
          <ul className="list-disc pl-5 text-zinc-600">
            {adviser?.education_background.map((edu, index) => (
              <li key={index}>{edu}</li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-medium">Experiencia</h3>
          <p className="text-zinc-600">
            {adviser?.experience_years} años de experiencia
          </p>
        </div>

        {/* Crops */}
        <div className="mb-4">
          <h3 className="text-lg font-medium">Cultivos</h3>
          <div className="flex flex-wrap gap-4">
            {adviser?.crops.map((crop) => (
              <div key={crop.id} className="flex items-center gap-2">
                <img
                  src={crop.icon_url}
                  alt={crop.name}
                  className="w-8 h-8 object-cover"
                />
                <p className="text-zinc-700">{crop.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mt-4">
          <h3 className="text-lg font-medium">Contacto</h3>
          <p className="text-zinc-700">
            <strong>Email 1:</strong> {adviser?.email_1}
          </p>
          {adviser?.email_2 && (
            <p className="text-zinc-700">
              <strong>Email 2:</strong> {adviser?.email_2}
            </p>
          )}
          <p className="text-zinc-700">
            <strong>Teléfono:</strong>{" "}
            {adviser?.phone_number ? adviser.phone_number : "sin numero"}
          </p>
          <p className="text-zinc-700">
            <strong>LinkedIn:</strong>{" "}
            {adviser?.linkedin ? (
              <a
                href={adviser?.linkedin}
                target="_blank"
                className="text-blue-500 underline"
              >
                {adviser?.linkedin}
              </a>
            ) : (
              <span className="text-sm text-zinc-600">Sin enlace</span>
            )}
          </p>

          <p className="text-zinc-700">
            <strong>Web:</strong>{" "}
            {adviser?.web ? (
              <a
                href={adviser?.web}
                target="_blank"
                className="text-blue-500 underline"
              >
                {adviser?.web}
              </a>
            ) : (
              <span className="text-sm text-zinc-600">Sin enlace</span>
            )}
          </p>
        </div>
      </div>
      <div className="flex justify-end">
        <ButtonForm
          text="Cerrar"
          onClick={() => {
            closeModal();
          }}
        />
      </div>
    </div>
  );
};
export default AdviserShow;
