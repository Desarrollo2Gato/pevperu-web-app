"use client";
import SubsTable from "../../components/tables/subsTable";
import {
  MainContainer,
  SafeAreaContainer,
} from "@/app/components/ui/containers";
import { useEffect, useState } from "react";
import { getTokenFromCookie } from "@/app/utils/api/getToken";
import axios from "axios";
import { apiUrls, pagination } from "@/app/utils/api/apiUrls";
import { ISubscription } from "@/app/types/api";
import SearchInput from "@/app/components/ui/searchInput";
import AddButton from "@/app/components/ui/addBtn";
import SubsForm from "@/app/components/forms/subsForm";
import SelectRows from "@/app/components/ui/selectRows";
import { toast } from "sonner";
import { ConfirmModal, FormModal } from "@/app/components/ui/modals";
import { Pagination } from "@mui/material";
import RenewModal from "@/app/components/ui/renewModal";

const Content = () => {
  // token
  const [token, setToken] = useState("");

  // pagination
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  // data
  const [data, setData] = useState<ISubscription[]>([]);

  // loading
  const [loading, setLoading] = useState(false);

  // modal
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [renewModal, setRenewModal] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<"edit" | "create">("create");
  const [selectedAction, setSelectedAction] = useState<
    "data" | "date" | "search" | "status"
  >("data");

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<"active" | "inactive" | "all">("all");
  
  useEffect(() => {
    //obtener token
    const token = getTokenFromCookie();
    if (token) {
      setToken(token);
    }
  }, []);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as "active" | "inactive";
    setStatus(newStatus);
    setSelectedAction("status");
  };

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        apiUrls.subscription.pagination(pageIndex, pageSize),
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

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setDeleteModal(true);
  };
  const onDelete = () => {
    if (!selectedId) return;
    const promise = new Promise(async (resolve, reject) => {
      try {
        await axios.delete(
          apiUrls.subscription.delete(selectedId?.toString()),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve({ message: "Suscripción eliminada" });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
        }
        reject({ message: "No se pudo eliminar la suscripción" });
      } finally {
        getData();
        setDeleteModal(false);
      }
    });

    toast.promise(promise, {
      loading: "Eliminando suscripción...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };

  const handleEdit = (id: number) => {
    setOpenModal(true);
    setSelectedId(id);
    setSelectedType("edit");
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleRenew = (id: number) => {
    setRenewModal(true);
    setSelectedId(id);
  };

  // filters
  const getSubsByStatus = (status: string) => {
    if (status === "all") {
      setSelectedAction("data");
      return;
    }
    const is_active = status === "active" ? 1 : 0;
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          apiUrls.subscription.getAll +
            "?is_active=" +
            is_active +
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
        resolve({ message: "Suscripciones filtradas" });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
        }
        reject({ message: "No se pudo filtrar por estado" });
      } finally {
        setDeleteModal(false);
      }
    });

    toast.promise(promise, {
      loading: "Filtrando suscripciones...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };

  // search

  const getSubsBySearch = (query: string) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.delete(
          apiUrls.subscription.getAll +
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
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
        }
        reject({ message: "No se pudo filtrar por estado" });
      } finally {
        getData();
        setDeleteModal(false);
      }
    });

    toast.promise(promise, {
      loading: "Filtrando suscripciones...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };
  const getSubsByDate = (start: Date, end: Date) => {};

  useEffect(() => {
    // limpiar data
    setData([]);
    console.log(selectedAction);
  }, [selectedAction]);

  useEffect(() => {
    console.log("data", data);
    console.log("selectedAction", selectedAction);
  }, [data]);

  useEffect(() => {
    if (token && selectedAction === "data") {
      getData();
    }
    console.log(selectedAction);
  }, [token, selectedAction, pageIndex]);

  // status
  useEffect(() => {
    if (token && selectedAction === "status") {
      getSubsByStatus(status);
    }
  }, [token, selectedAction, status, pageIndex]);

  return (
    <>
      <SafeAreaContainer isTable>
        <div className="mb-4">
          <MainContainer title="Filtros">
            <div className="flex gap-1 flex-wrap justify-between mb-4 flex-row w-full">
              <div className="flex flex-col justify-between">
                <label
                  htmlFor="statusFilter"
                  className="text-xs font-medium text-green-800 "
                >
                  Estado
                </label>
                <select
                  id="statusFilter"
                  className="mt-1 border border-zinc-300 text-xs rounded-md px-2 py-1 text-zinc-600 focus:border-green-800 focus:ring-green-800"
                  onChange={handleStatusChange}
                  defaultValue={status}
                >
                  <option value="all">Todos</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>
              <div className="flex flex-col justify-between">
                <label
                  htmlFor="statusFilter"
                  className="text-xs font-medium text-green-800 "
                >
                  Plan
                </label>
                <select
                  id="statusFilter"
                  className="mt-1 border border-zinc-300 text-xs rounded-md px-2 py-1 text-zinc-600 focus:border-green-800 focus:ring-green-800"
                  onChange={handleStatusChange}
                  defaultValue={status}
                >
                  <option value="all">Todos</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>
              <div className="flex gap-1">
                <label
                  htmlFor="statusFilter"
                  className="flex flex-col text-xs font-medium text-green-800 "
                >
                  Fecha de inicio
                  <input
                    type="date"
                    className="mt-1 border border-zinc-300 text-xs rounded-md px-2 py-1 text-zinc-600 focus:border-green-800 focus:ring-green-800"
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                  />
                </label>
                <label
                  htmlFor="statusFilter"
                  className="flex flex-col text-xs font-medium text-green-800 "
                >
                  Fecha de fin
                  <input
                    type="date"
                    className="mt-1 border border-zinc-300 text-xs rounded-md px-2 py-1 text-zinc-600 focus:border-green-800 focus:ring-green-800"
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                  />
                </label>
              </div>
            </div>
          </MainContainer>
        </div>

        <MainContainer>
          <div className="flex flex-row justify-between pb-4 border-b border-b-gray-50 items-center">
            <h2>Registros: {total}</h2>{" "}
            <AddButton text="Agregar Suscripción" onClick={handleAdd} />
          </div>

          <div className="flex justify-between mb-4 pt-4">
            <SelectRows
              pageSize={pageSize.toString()}
              handlePageSizeChange={handlePageSizeChange}
            />
            <div className="flex flex-row self-end">
              <SearchInput />
            </div>
          </div>
          <div className=" overflow-x-auto">
            <SubsTable
              dataTable={data}
              onDelete={(id: number) => handleDelete(id)}
              onEdit={(id: number) => handleEdit(id)}
              onRenew={(id: number) => handleRenew(id)}
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
      {/* form modal */}
      <FormModal
        title={`${selectedType === "edit" ? "Editar" : "Crear"} suscripción`}
        openModal={openModal}
        setOpenModal={() => setOpenModal(false)}
      >
        <SubsForm
          closeModal={handleCloseModal}
          type={selectedType}
          id={selectedId}
          token={token}
          getData={getData}
        />
      </FormModal>
      {/* delete modal */}
      <ConfirmModal
        openModal={deleteModal}
        setOpenModal={() => setDeleteModal(false)}
        onAction={onDelete}
        title="Eliminar Subscripción"
      />
      {/* renewModal */}
      {selectedId && (
        <RenewModal
          openModal={renewModal}
          setOpenModal={() => setRenewModal(false)}
          token={token}
          id={selectedId}
          getData={getData}
        />
      )}
    </>
  );
};

export default Content;
