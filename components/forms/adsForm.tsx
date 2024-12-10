import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adsSchema } from "@/utils/shcemas/Admin";
import { useEffect, useState } from "react";
import { apiUrls } from "@/utils/api/apiUrls";
import axios from "axios";
import { toast } from "sonner";
import ButtonForm from "../ui/buttonForm";
import { IAds, ICompany, IProduct } from "@/types/api";
import { useAuthContext } from "@/context/authContext";
import { SelectZodField } from "../ui/selectField";
import { ImgField } from "../ui/imgField";
import { imgUrl } from "@/utils/img/imgUrl";

type AdsFormProps = {
  type: "create" | "edit";
  id?: number | null;
  token: string;
  closeModal: () => void;
  getData: () => void;
};

const AdsForm: React.FC<AdsFormProps> = ({
  type,
  id,
  token,
  closeModal,
  getData,
}) => {
  const { user } = useAuthContext();
  const [ads, setAds] = useState<IAds>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [companies, setCompanies] = useState<ICompany[]>([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [img, setImg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(adsSchema),
    defaultValues: {
      company_id: user?.company_id ? user.company_id.toString() : "",
      type: "",
      id_product: "",
      img: null,
    },
  });
  useEffect(() => {
    if (type === "edit" && id) {
      getDataById(id?.toString());
    }
  }, [id, type]);
  useEffect(() => {
    getCompanies();
  }, []);

  useEffect(() => {
    if (ads) {
      if (ads.banner_url) {
        setImg(imgUrl(ads.banner_url));
      }
      reset({
        company_id: ads.company_id.toString(),
        type: ads.type,
        img: null,
      });
    }
  }, [ads]);

  useEffect(() => {
    if (watch("type") === "product") {
      getProducts();
    }
  }, [watch("type")]);

  useEffect(() => {
    if (products.length > 0 && ads?.product_id) {
      setValue("id_product", ads ? ads.product_id.toString() : "");
    }
  }, [products, ads]);

  const getDataById = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrls.banner.getOne(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAds(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener los datos");
    } finally {
      setLoading(false);
    }
  };
  const getCompanies = async () => {
    try {
      const res = await axios.get(`${apiUrls.company.getAll}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCompanies(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener los datos");
    } finally {
      setLoading(false);
    }
  };
  const getProducts = async () => {
    if (user?.type === "admin") {
      try {
        const res = await axios.get(`${apiUrls.product.getAll}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Error al obtener los datos");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await axios.get(
          `${apiUrls.company.getAll}/${user?.company_id}/product`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProducts(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Error al obtener los datos");
      } finally {
        setLoading(false);
      }
    }
  };

  const onSubmit = async (data: any) => {
    console.log("data", data);
    setSubmitting(true);
    const dataSend = new FormData();
    dataSend.append("type", data.type);
    dataSend.append("company_id", data.company_id);
    if (data.id_product) {
      console.log("product_id", data.id_product);
      dataSend.append("product_id", data.id_product);
    }
    // icon
    if (data.img) {
      dataSend.append("photo", data.img[0]);
    }
    console.log("dataSend", dataSend.getAll("product_id"));
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (type === "create") {
          await axios.post(apiUrls.banner.create, dataSend, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          resolve({ message: "Publicidad creada exitosamente" });
        }
        if (type === "edit") {
          if (id) {
            await axios.post(apiUrls.banner.update(id?.toString()), dataSend, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            });
            resolve({ message: "Publicidad actualizada exitosamente" });
          } else {
            reject("No se ha podido obtener el id de la publicidad");
          }
        }
        closeModal();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log("error api", error);
          console.log("error api", error.response?.data);
          reject({ message: error.response?.data.message });
        }
      } finally {
        setSubmitting(false);
        getData();
      }
    });
    toast.promise(promise, {
      loading: "Guardando datos...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };

  return (
    <>
      <form className="flex flex-col gap-2 mt-4">
        <div className="flex justify-center "></div>

        {/* home */}
        <SelectZodField
          id="type"
          name="Mostrar en "
          options={[
            ...(user?.type === "admin"
              ? [{ value: "home", label: "Inicio" }]
              : []),
            { id: "intern", value: "Entre vistas" },
            { id: "product", value: "Producto" },
          ]}
          placeholder="Seleccione en donde mostrar"
          getOptionValue={(option) => option.id}
          getOptionLabel={(option) => option.value}
          register={register("type")}
          error={errors.type}
        />
        <SelectZodField
          id="company"
          name="Proveedor"
          options={companies}
          placeholder="Seleccione un proveedor"
          getOptionValue={(option) => option.id}
          getOptionLabel={(option) => option.name}
          register={register("company_id")}
          error={errors.company_id}
          isdisabled={user?.type !== "admin"}
        />
        
        <SelectZodField
          id="id_product"
          name="Asociar a producto"
          options={products}
          placeholder="Seleccione un producto"
          getOptionValue={(option) => option.id}
          getOptionLabel={(option) => option.name}
          register={register("id_product")}
          error={errors.id_product}
          isrequired
          isdisabled={watch("type") !== "product"}
        />

        <label className=" font-medium text-green-800 text-base">
          Imagen de publicidad
        </label>
        <ImgField
          id="img"
          imgLogo={img || ""}
          setImgLogo={setImg}
          error={errors.img}
          register={register("img")}
          watch={watch("img")}
          isPost
        />
        <div className="gap-8 flex justify-end items-center mt-4">
          <ButtonForm
            isdisabled={submitting}
            text="Cancelar"
            onClick={() => {
              reset();
              closeModal();
            }}
          />
          <ButtonForm
            text={loading ? "Guardando..." : "Guardar"}
            onClick={handleSubmit(onSubmit)}
            primary
          />
        </div>
      </form>
    </>
  );
};

export default AdsForm;
