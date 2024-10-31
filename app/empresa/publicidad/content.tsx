"use client";
import AddButton from "@/components/ui/addBtn";
import { MainContainer, SafeAreaContainer } from "@/components/ui/containers";
import { IAds } from "@/types/api";
import { apiUrls, pagination } from "@/utils/api/apiUrls";
import { getTokenFromCookie } from "@/utils/api/getToken";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import SelectRows from "@/components/ui/selectRows";
import { toast } from "sonner";
import { ConfirmModal, FormModal } from "@/components/ui/modals";
import SelectComponent from "@/components/ui/select";
import { useAuthContext } from "@/context/authContext";
import AdsForm from "@/components/forms/adsForm";
import AdsTable from "@/components/tables/adsTable";

const Content = () => {
  const [token, setToken] = useState("");
  const { user } = useAuthContext();

  // pagination
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  // data
  const [data, setData] = useState<IAds[]>([]);

  // loading
  const [loading, setLoading] = useState(false);

  // search
  const [searchQuery, setSearchQuery] = useState<string>("");
  // filters

  const [typeFilter, setTypeFilter] = useState<
    "home" | "intern" | "product" | "all"
  >("all");

  // modal
  const [openModal, setOpenModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"delete">("delete");

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<"edit" | "create">("create");

  const [selectedAction, setSelectedAction] = useState<
    "data" | "search" | "type"
  >("data");

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      setToken(token);
    }
  }, []);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPageIndex(newPage);
  };
  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setPageSize(parseInt(selectedValue, 10));
    setPageIndex(1);
  };
  const handleAdd = () => {
    setOpenModal(true);
    setSelectedType("create");
  };

  const handleStatus = (id: number, status: "delete") => {
    setSelectedId(id);
    setSelectedStatus(status);
    setStatusModal(true);
  };
  const handleChangeStatus = () => {
    if (!selectedId) return;
    if (selectedStatus === "delete") {
      onDelete();
    }
  };
  const handleEdit = (id: number) => {
    setOpenModal(true);
    setSelectedId(id);
    setSelectedType("edit");
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as "home" | "intern" | "product";
    newStatus;
    setTypeFilter(newStatus);
    setSelectedAction("type");
  };

  const onDelete = () => {
    if (!selectedId) return;
    const promise = new Promise(async (resolve, reject) => {
      try {
        await axios.delete(apiUrls.banner.delete(selectedId?.toString()), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resolve({ message: "Publicidad eliminado" });
      } catch (error) {
        // if (axios.isAxiosError(error)) {
        //   console.log(error.response?.data);
        // }
        reject({ message: "No se pudo eliminar la publicidad" });
      } finally {
        getData();
        setStatusModal(false);
      }
    });

    toast.promise(promise, {
      loading: "Eliminando publicidad...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };

  const getData = async () => {
    if (!user) {
      toast.error("No se ha podido obtener el id de la empresa");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        apiUrls.banner.byCompany(user.company_id.toString()) + "?" + pagination(pageIndex, pageSize),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("data", response.data.data);
      setData(response.data.data);
      setPageCount(response.data.last_page);
      setTotal(response.data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getNewsBySearch = (query: string) => {
    setSelectedAction("search");
    if (!user) {
      toast.error("No se ha podido obtener el id de la empresa");
      return;
    }
    setSearchQuery(query);
    setLoading(true);
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          apiUrls.news.myNews(user.company_id.toString()) +
            "?like=" +
            query +
            "&" +
            pagination(pageIndex, pageSize),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data.data);
        setPageCount(res.data.last_page);
        setTotal(res.data.total);
        resolve({ message: "Busqueda exitosa" });
      } catch (error) {
        // if (axios.isAxiosError(error)) {
        //   console.log(error.response?.data);
        // }
        reject({ message: "Error al buscar publicidad" });
      } finally {
        setLoading(false);
      }
    });

    toast.promise(promise, {
      loading: "Buscando publicidad...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };
  const getNewsByStatus = (
    status: "home" | "intern" | "product" | "all"
  ) => {
    if (status === "all") {
      setSelectedAction("data");
      return;
    }
    setLoading(true);
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (!user) {
          toast.error("No se ha podido obtener el id de la empresa");
          return;
        }
        const res = await axios.get(
          apiUrls.news.myNews(user?.company_id.toString()) +
            "?status=" +
            status +
            "&" +
            pagination(pageIndex, pageSize),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data.data);
        setPageCount(res.data.last_page);
        setTotal(res.data.total);
        resolve({ message: "Publicidad filtrados" });
      } catch (error) {
        // if (axios.isAxiosError(error)) {
        //   console.log(error.response?.data);
        // }
        reject({ message: "Error al filtrar publicidads por estado" });
      } finally {
        setLoading(false);
      }
    });
    toast.promise(promise, {
      loading: "Filtrando publicidads...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };
  useEffect(() => {
    setData([]);
  }, [selectedAction]);
  useEffect(() => {
    if (token && selectedAction === "data") {
      getData();
    }
  }, [token, selectedAction, pageIndex, pageSize]);
  useEffect(() => {
    if (token && selectedAction === "search") {
      getNewsBySearch(searchQuery);
    }
  }, [token, selectedAction, pageIndex, pageSize]);
  useEffect(() => {
    if (token && selectedAction === "type") {
      getNewsByStatus(typeFilter);
    }
  }, [token, selectedAction, typeFilter,pageIndex, pageSize]);

  return (
    <>
      <SafeAreaContainer isTable>
        <div className="mb-4">
          <MainContainer title="Filtros">
            <div className="flex gap-1 flex-wrap justify-between mb-4 flex-row w-full">
              <SelectComponent
                label="Typo"
                id="typeFilter"
                options={[
                  { value: "all", label: "Todos" },
                  { value: "home", label: "Inicio" },
                  { value: "intern", label: "Entre vistas" },
                  { value: "product", label: "Producto" },
                ]}
                onChange={handleStatusChange}
                defaultValue={typeFilter}
              />
            </div>
          </MainContainer>
        </div>
        <MainContainer>
          <div className="flex flex-col md:flex-row  md:justify-between pb-4 border-b border-b-gray-50 items-center gap-4">
            <h2 className="font-medium text-zinc-500 text-lg w-full md:w-auto">
              Registros ({total})
            </h2>{" "}
            <div className="w-full md:w-auto flex justify-end">
              <AddButton text="Agregar Publicidad" onClick={handleAdd} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-between mb-4 pt-4">
            <SelectRows
              pageSize={pageSize.toString()}
              handlePageSizeChange={handlePageSizeChange}
            />
            {/* <div className="w-full sm:w-auto flex flex-row self-end">
              <SearchInput
                placeholder="Buscar publicidads"
                onClick={(query) => getNewsBySearch(query)}
              />
            </div> */}
          </div>
          <div className=" overflow-x-auto">
            <AdsTable
              dataTable={data}
              onDelete={(id: number) => handleStatus(id, "delete")}
              onEdit={(id: number) => handleEdit(id)}
            />
          </div>
          <div className="mt-4 justify-center flex">
            <Pagination
              count={pageCount}
              page={pageIndex}
              boundaryCount={2}
              onChange={handlePageChange}
            />
          </div>
        </MainContainer>
      </SafeAreaContainer>
      <FormModal
        title={`${selectedType === "edit" ? "Editar" : "Crear"} publicidad`}
        openModal={openModal}
        setOpenModal={() => setOpenModal(false)}
      >
        <AdsForm
          closeModal={handleCloseModal}
          type={selectedType}
          id={selectedId}
          token={token}
          getData={getData}
        />
      </FormModal>
      <ConfirmModal
        openModal={statusModal}
        setOpenModal={() => setStatusModal(false)}
        onAction={handleChangeStatus}
        title={
          selectedStatus === "delete"
            ? "Eliminar Publicidad"
            : "Aprobar Publicidad"
        }
        text={
          selectedStatus === "delete"
            ? "¿Está seguro que desea eliminar esta publicidad?"
            : "¿Está seguro que desea rechazar esta publicidad?"
        }
        textButton={selectedStatus === "delete" ? "Eliminar" : "Aprobar"}
      />
    </>
  );
};

export default Content;
