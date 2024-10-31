"use client";
import AddButton from "@/components/ui/addBtn";
import {
  MainContainer,
  SafeAreaContainer,
} from "@/components/ui/containers";
import SearchInput from "@/components/ui/searchInput";
import { ICompany, IEvents } from "@/types/api";
import { apiUrls, pagination } from "@/utils/api/apiUrls";
import { getTokenFromCookie } from "@/utils/api/getToken";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import EventsTable from "@/components/tables/eventsTable";
import SelectRows from "@/components/ui/selectRows";
import EventForm from "@/components/forms/eventForm";
import { ConfirmModal, FormModal } from "@/components/ui/modals";
import { toast } from "sonner";
import RejectForm from "@/components/forms/rejectedForm";
import SelectComponent from "@/components/ui/select";

const Content = () => {
  // token
  const [token, setToken] = useState("");

  // pagination
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  // data
  const [data, setData] = useState<IEvents[]>([]);
  const [providers, setProviders] = useState<ICompany[]>([]);

  // loading
  const [loading, setLoading] = useState(false);

  // modal
  const [openModal, setOpenModal] = useState(false);
  const [rejectedModal, setRejectedModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);

  // search
  const [searchQuery, setSearchQuery] = useState<string>("");
  // filters
  const [typeFilter, setTypeFilter] = useState<
    "all" | "Nacional" | "Internacional"
  >("all");
  const [providerFilter, setProviderFilter] = useState<"all" | string>("all");
  const [statusFilter, setStatusFilter] = useState<
    "pending" | "approved" | "rejected" | "all"
  >("all");

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<"edit" | "create">("create");
  const [selectedStatus, setSelectedStatus] = useState<"delete" | "approved">(
    "delete"
  );

  const [selectedAction, setSelectedAction] = useState<
    "data" | "search" | "status" | "type" | "provider"
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
  const handleEdit = (id: number) => {
    setOpenModal(true);
    setSelectedId(id);
    setSelectedType("edit");
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleChangeStatus = () => {
    if (!selectedId) return;
    if (selectedStatus === "delete") {
      onDelete();
    } else {
      onApprove(selectedId.toString());
    }
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
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as "Nacional" | "Internacional";
    newType;
    setTypeFilter(newType);
    setSelectedAction("type");
  };

  const onApprove = async (id: string) => {
    const promise = new Promise(async (resolve, rejects) => {
      try {
        await axios.post(
          apiUrls.admin.approve("event", id),
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve({ message: "Evento aprobado" });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
        }
        rejects({ message: "No se pudo aprobar el evento" });
      } finally {
        getData();
        setStatusModal(false);
      }
    });
    toast.promise(promise, {
      loading: "Aprobando evento...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };
  const onDelete = () => {
    if (!selectedId) return;
    const promise = new Promise(async (resolve, reject) => {
      try {
        await axios.delete(apiUrls.event.delete(selectedId?.toString()), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resolve({ message: "Evento eliminado" });
      } catch (error) {
        // if (axios.isAxiosError(error)) {
        //   console.log(error.response?.data);
        // }
        reject({ message: "No se pudo eliminar el evento" });
      } finally {
        getData();
        setStatusModal(false);
      }
    });

    toast.promise(promise, {
      loading: "Eliminando evento...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
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
  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        apiUrls.event.pagination(pageIndex, pageSize),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data);

      setData(response.data.data);
      setPageCount(response.data.last_page);
      setTotal(response.data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const getEventsBySearch = (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          apiUrls.event.getAll +
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
        reject({ message: "Error al buscar eventos" });
      } finally {
        setLoading(false);
      }
    });

    toast.promise(promise, {
      loading: "Buscando eventos...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };
  const getEventByStatus = (
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
          apiUrls.event.getAll +
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
        resolve({ message: "Eventos filtrados" });
      } catch (error) {
        // if (axios.isAxiosError(error)) {
        //   console.log(error.response?.data);
        // }
        reject({ message: "Error al filtrar eventos por estado" });
      } finally {
        setLoading(false);
      }
    });
    toast.promise(promise, {
      loading: "Filtrando eventos...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };
  const getEventsByType = (type: "Nacional" | "Internacional" | "all") => {
    if (type === "all") {
      setSelectedAction("data");
      return;
    }
    setLoading(true);
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          apiUrls.event.getAll +
            "?type=" +
            type +
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
        resolve({ message: "Eventos filtrados" });
      } catch (error) {
        // if (axios.isAxiosError(error)) {
        //   console.log(error.response?.data);
        // }
        reject({ message: "Error al filtrar eventos por tipo" });
      } finally {
        setLoading(false);
      }
    });
    toast.promise(promise, {
      loading: "Filtrando eventos...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };
  const getEventsByProvider = async (provider: "all" | string) => {
    if (provider === "all") {
      setSelectedAction("data");
      return;
    }
    setLoading(true);
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          apiUrls.event.myEvents(provider.toString()) +
            "?" +
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
        resolve({ message: "Eventos filtrados" });
      } catch (error) {
        // if (axios.isAxiosError(error)) {
        //   console.log(error.response?.data);
        // }
        reject({ message: "Error al filtrar eventos por proveedor" });
      } finally {
        setLoading(false);
      }
    });
    toast.promise(promise, {
      loading: "Filtrando eventos...",
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
      getEventsBySearch(searchQuery);
    }
  }, [token, selectedAction, pageIndex]);
  useEffect(() => {
    if (token && selectedAction === "status") {
      getEventByStatus(statusFilter);
    }
  }, [token, selectedAction, statusFilter, pageIndex]);
  useEffect(() => {
    if (token && selectedAction === "type") {
      getEventsByType(typeFilter);
    }
  }, [token, selectedAction, typeFilter, pageIndex]);
  useEffect(() => {
    if (token && selectedAction === "provider") {
      getEventsByProvider(providerFilter);
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
                label="Tipo"
                id="typeFilter"
                options={[
                  { value: "all", label: "Todos" },
                  { value: "Nacional", label: "Nacional" },
                  { value: "Internacional", label: "Internacional" },
                ]}
                onChange={handleTypeChange}
                defaultValue={typeFilter}
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
              <AddButton text="Agregar Evento" onClick={handleAdd} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-between mb-4 pt-4">
            <SelectRows
              pageSize={pageSize.toString()}
              handlePageSizeChange={handlePageSizeChange}
            />
            <div className="w-full sm:w-auto flex flex-row self-end">
              <SearchInput
                placeholder="Buscar evento"
                onClick={(query) => getEventsBySearch(query)}
              />
            </div>
          </div>
          {loading ? (
            <div className="w-full h-60 animate-pulse bg-gray-100 rounded-md duration-500"></div>
          ) : (
            <div className=" overflow-x-auto">
              <EventsTable
                dataTable={data}
                onDelete={(id: number) => handleStatus(id, "delete")}
                onEdit={(id: number) => handleEdit(id)}
                onApprove={(id: number) => handleStatus(id, "approved")}
                onReject={(id: number) => handleRejected(id)}
              />
            </div>
          )}
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
        title={`${selectedType === "edit" ? "Editar" : "Crear"} evento`}
        openModal={openModal}
        setOpenModal={() => setOpenModal(false)}
      >
        <EventForm
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
          selectedStatus === "delete" ? "Eliminar Evento" : "Aprobar Evento"
        }
        text={
          selectedStatus === "delete"
            ? "¿Está seguro que desea eliminar este evento?"
            : "¿Está seguro que desea rechazar este evento?"
        }
        textButton={selectedStatus === "delete" ? "Eliminar" : "Aprobar"}
      />
      {selectedId && (
        <FormModal
          title={`Rechazar evento`}
          openModal={rejectedModal}
          setOpenModal={() => setRejectedModal(false)}
        >
          <RejectForm
            closeModal={() => setRejectedModal(false)}
            type="event"
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
