"use client";
import AddButton from "@/app/components/ui/addBtn";
import {
  MainContainer,
  SafeAreaContainer,
} from "@/app/components/ui/containers";
import SearchInput from "@/app/components/ui/searchInput";
import { ICompany, INews } from "@/app/types/api";
import { apiUrls, pagination } from "@/app/utils/api/apiUrls";
import { getTokenFromCookie } from "@/app/utils/api/getToken";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import NewsForm from "@/app/components/forms/newsForm";
import NewsTable from "@/app/components/tables/newsTable";
import SelectRows from "@/app/components/ui/selectRows";
import { toast } from "sonner";
import { ConfirmModal, FormModal } from "@/app/components/ui/modals";
import RejectForm from "@/app/components/forms/rejectedForm";
import SelectComponent from "@/app/components/ui/select";

const Content = () => {
  const [token, setToken] = useState("");

  // pagination
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  // data
  const [data, setData] = useState<INews[]>([]);
  const [providers, setProviders] = useState<ICompany[]>([]);

  // loading
  const [loading, setLoading] = useState(false);

  // search
  const [searchQuery, setSearchQuery] = useState<string>("");
  // filters
  const [providerFilter, setProviderFilter] = useState<"all" | string>("all");
  const [statusFilter, setStatusFilter] = useState<
    "pending" | "approved" | "rejected" | "all"
  >("all");

  // modal
  const [openModal, setOpenModal] = useState(false);
  const [rejectedModal, setRejectedModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"delete" | "approved">(
    "delete"
  );

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<"edit" | "create">("create");

  const [selectedAction, setSelectedAction] = useState<
    "data" | "search" | "status" | "provider"
  >("data");

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      setToken(token);
    }
  }, []);
  useEffect(() => {
    if (token) {
      getProviders();
    }
  }, [token]);

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
  const handleRejected = (id: number) => {
    setSelectedId(id);
    setRejectedModal(true);
  };
  const handleStatus = (id: number, status: "delete" | "approved") => {
    setSelectedId(id);
    setSelectedStatus(status);
    setStatusModal(true);
  };
  const handleChangeStatus = () => {
    if (!selectedId) return;
    if (selectedStatus === "delete") {
      onDelete();
    } else {
      onApprove(selectedId.toString());
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
  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvider = e.target.value as "all" | string;
    newProvider;
    setProviderFilter(newProvider);
    setSelectedAction("provider");
  };
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as "pending" | "approved" | "rejected";
    newStatus;
    setStatusFilter(newStatus);
    setSelectedAction("status");
  };

  const onApprove = async (id: string) => {
    const promise = new Promise(async (resolve, rejects) => {
      try {
        await axios.post(
          apiUrls.admin.approve("news", id),
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve({ message: "Noticia aprobado" });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
        }
        rejects({ message: "No se pudo aprobar la noticia" });
      } finally {
        getData();
        setStatusModal(false);
      }
    });
    toast.promise(promise, {
      loading: "Aprobando noticia...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };
  const onDelete = () => {
    if (!selectedId) return;
    const promise = new Promise(async (resolve, reject) => {
      try {
        await axios.delete(apiUrls.news.delete(selectedId?.toString()), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resolve({ message: "Noticia eliminado" });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
        }
        reject({ message: "No se pudo eliminar la noticia" });
      } finally {
        getData();
        setStatusModal(false);
      }
    });

    toast.promise(promise, {
      loading: "Eliminando noticia...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        apiUrls.news.pagination(pageIndex, pageSize),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.data);
      setPageCount(response.data.last_page);
      setTotal(response.data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const getProviders = async () => {
    try {
      const response = await axios.get(apiUrls.company.getAll, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProviders(response.data);
    } catch (error) {
      toast.error("Error al obtener proveedores");
      console.error(error);
    }
  };
  const getNewsBySearch = (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          apiUrls.news.getAll +
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
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
        }
        reject({ message: "Error al buscar noticias" });
      } finally {
        setLoading(false);
      }
    });

    toast.promise(promise, {
      loading: "Buscando noticias...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };
  const getNewsByStatus = (
    status: "pending" | "approved" | "rejected" | "all"
  ) => {
    if (status === "all") {
      setSelectedAction("data");
      return;
    }
    setLoading(true);
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          apiUrls.news.getAll +
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
        resolve({ message: "Noticias filtradas" });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
        }
        reject({ message: "Error al filtrar noticias por estado" });
      } finally {
        setLoading(false);
      }
    });
    toast.promise(promise, {
      loading: "Filtrando noticias...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };
  const getNewsByProvider = async (provider: "all" | string) => {
    if (provider === "all") {
      setSelectedAction("data");
      return;
    }
    setLoading(true);
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          apiUrls.news.myNews(provider.toString()) +
            "?" +
            pagination(pageIndex, pageSize),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res.data.data);
        setData(res.data.data);
        setPageCount(res.data.last_page);
        setTotal(res.data.total);
        resolve({ message: "Noticias filtradas" });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
        }
        reject({ message: "Error al filtrar noticias por proveedor" });
      } finally {
        setLoading(false);
      }
    });
    toast.promise(promise, {
      loading: "Filtrando noticias...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };

  useEffect(() => {
    // limpiar data
    setData([]);
  }, [selectedAction]);
  useEffect(() => {
    if (token && selectedAction === "data") {
      getData();
    }
  }, [token, selectedAction, pageIndex]);
  useEffect(() => {
    if (token && selectedAction === "search") {
      getNewsBySearch(searchQuery);
    }
  }, [token, selectedAction, pageIndex]);
  useEffect(() => {
    if (token && selectedAction === "status") {
      getNewsByStatus(statusFilter);
    }
  }, [token, selectedAction, statusFilter, pageIndex]);
  useEffect(() => {
    if (token && selectedAction === "provider") {
      getNewsByProvider(providerFilter);
    }
  }, [token, selectedAction, providerFilter, pageIndex]);
  return (
    <>
      <SafeAreaContainer isTable>
        <div className="mb-4">
          <MainContainer title="Filtros">
            <div className="flex gap-1 flex-wrap justify-between mb-4 flex-row w-full">
              <SelectComponent
                label="Estado"
                id="statusFilter"
                options={[
                  { value: "all", label: "Todos" },
                  { value: "pending", label: "Pendientes" },
                  { value: "approved", label: "Aprobados" },
                  { value: "rejected", label: "Rechazados" },
                ]}
                onChange={handleStatusChange}
                defaultValue={statusFilter}
              />
              <SelectComponent
                label="Proveedor"
                id="providerFilter"
                options={[
                  { value: "all", label: "Todos" },
                  ...providers.map((provider) => ({
                    value: provider.id,
                    label: `${provider.ruc} | ${provider.name}`,
                  })),
                ]}
                onChange={handleProviderChange}
                defaultValue={providerFilter}
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
              <AddButton text="Agregar Noticia" onClick={handleAdd} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-between mb-4 pt-4">
            <SelectRows
              pageSize={pageSize.toString()}
              handlePageSizeChange={handlePageSizeChange}
            />
            <div className="w-full sm:w-auto flex flex-row self-end">
              <SearchInput
                placeholder="Buscar noticias"
                onClick={(query) => getNewsBySearch(query)}
              />
            </div>
          </div>
          <div className=" overflow-x-auto">
            <NewsTable
              dataTable={data}
              onDelete={(id: number) => handleStatus(id, "delete")}
              onEdit={(id: number) => handleEdit(id)}
              onApprove={(id: number) => handleStatus(id, "approved")}
              onReject={(id: number) => handleRejected(id)}
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
        title={`${selectedType === "edit" ? "Editar" : "Crear"} noticia`}
        openModal={openModal}
        setOpenModal={() => setOpenModal(false)}
      >
        <NewsForm
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
          selectedStatus === "delete" ? "Eliminar Noticia" : "Aprobar Noticia"
        }
        text={
          selectedStatus === "delete"
            ? "¿Está seguro que desea eliminar esta noticia?"
            : "¿Está seguro que desea rechazar esta noticia?"
        }
        textButton={selectedStatus === "delete" ? "Eliminar" : "Aprobar"}
      />
      {selectedId && (
        <FormModal
          title={`Rechazar Noticia`}
          openModal={rejectedModal}
          setOpenModal={() => setRejectedModal(false)}
        >
          <RejectForm
            closeModal={() => setRejectedModal(false)}
            type="news"
            id={selectedId}
            token={token}
            getData={getData}
          />
        </FormModal>
      )}
    </>
  );
};

export default Content;
