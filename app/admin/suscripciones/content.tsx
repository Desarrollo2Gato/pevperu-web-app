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
import { ICompany, IPlan, ISubscription } from "@/app/types/api";
import AddButton from "@/app/components/ui/addBtn";
import SubsForm from "@/app/components/forms/subsForm";
import SelectRows from "@/app/components/ui/selectRows";
import { toast } from "sonner";
import { ConfirmModal, FormModal } from "@/app/components/ui/modals";
import { Pagination } from "@mui/material";
import RenewModal from "@/app/components/ui/renewModal";
import SelectComponent from "@/app/components/ui/select";

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
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [providers, setProviders] = useState<ICompany[]>([]);

  // loading
  const [loading, setLoading] = useState(false);

  // modal
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [renewModal, setRenewModal] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<"edit" | "create">("create");
  const [selectedAction, setSelectedAction] = useState<
    "data" | "date" | "status" | "provider" | "plan"
  >("data");

  // filters
  const [planFilter, setPlanFilter] = useState<"all" | string>("all");
  const [providerFilter, setProviderFilter] = useState<"all" | string>("all");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [status, setStatus] = useState<"active" | "inactive" | "all">("all");

  useEffect(() => {
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
  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPlan = e.target.value;
    setPlanFilter(newPlan);
    setSelectedAction("plan");
  };
  const handleDatesChange = () => {
    if (!startDate || !endDate) return;
    setSelectedAction("date");
    getSubsByDate(startDate, endDate);
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
  const getPlans = async () => {
    try {
      const response = await axios.get(apiUrls.plan.getAll, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlans(response.data);
    } catch (error) {
      console.error(error);
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
  const getSubsByPlan = (plan: string) => {
    if (plan === "all") {
      setSelectedAction("data");
      return;
    }
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          apiUrls.subscription.getAll +
            "?plan_id=" +
            plan +
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
        reject({ message: "No se pudo filtrar por plan" });
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
  const getSubsByDate = (start: Date, end: Date) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          apiUrls.subscription.getAll +
            "?start_date=" +
            start.toISOString() +
            "&end_date=" +
            end.toISOString() +
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
        reject({ message: "No se pudo filtrar por fecha" });
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

  useEffect(() => {
    setData([]);
  }, [selectedAction]);

  useEffect(() => {
    if (token) {
      getPlans();
      getProviders();
    }
  }, [token]);
  useEffect(() => {
    if (token && selectedAction === "data") {
      getData();
    }
  }, [token, selectedAction, pageIndex]);
  // status
  useEffect(() => {
    if (token && selectedAction === "status") {
      getSubsByStatus(status);
    }
  }, [token, selectedAction, status, pageIndex]);
  useEffect(() => {
    if (token && selectedAction === "plan") {
      getSubsByPlan(planFilter);
    }
  }, [token, selectedAction, planFilter, pageIndex]);
  useEffect(() => {
    if (token && selectedAction === "date") {
      getSubsByDate(startDate!, endDate!);
    }
  }, [token, selectedAction, startDate, endDate, pageIndex]);

  return (
    <>
      <SafeAreaContainer isTable>
        <div className="mb-4">
          <MainContainer title="Filtros">
            <div className="flex flex-wrap md:flex-row flex-col gap-4 justify-between">
              <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 justify-between">
                <SelectComponent
                  label="Estado"
                  id="statusFilter"
                  options={[
                    { value: "all", label: "Todos" },
                    { value: "active", label: "Activos" },
                    { value: "inactive", label: "Inactivos" },
                  ]}
                  onChange={handleStatusChange}
                  defaultValue={status}
                />
                <SelectComponent
                  label="Plan"
                  id="planFilter"
                  options={[
                    { value: "all", label: "Todos" },
                    ...plans.map((plan) => ({
                      value: plan.id.toString(),
                      label: plan.name,
                    })),
                  ]}
                  onChange={handlePlanChange}
                  defaultValue={planFilter}
                />
              </div>

              <div className="w-full lg:w-auto flex flex-col sm:flex-row justify-between gap-4">
                <label
                  htmlFor="statusFilter"
                  className="flex flex-col font-medium text-green-800 md:max-w-[300px] md:min-w-[200px] w-full "
                >
                  Fecha de inicio
                  <input
                    type="date"
                    value={startDate?.toISOString().split("T")[0]}
                    className="mt-1 border border-zinc-300 text-sm rounded-md px-4 py-1.5 text-zinc-600 focus:border-green-800 focus:ring-green-800 w-full"
                    onChange={(e) => {
                      setStartDate(new Date(e.target.value));
                      handleDatesChange();
                    }}
                  />
                </label>
                <label
                  htmlFor="statusFilter"
                  className="flex flex-col font-medium text-green-800 md:max-w-[300px] md:min-w-[200px] w-full"
                >
                  Fecha de fin
                  <input
                    type="date"
                    value={endDate?.toISOString().split("T")[0]}
                    className="mt-1 border border-zinc-300 text-sm rounded-md px-4 py-1.5 text-zinc-600 focus:border-green-800 focus:ring-green-800  w-full"
                    onChange={(e) => {
                      setEndDate(new Date(e.target.value));
                      handleDatesChange();
                    }}
                  />
                </label>
              </div>
            </div>
          </MainContainer>
        </div>
        <MainContainer>
          <div className="flex flex-col md:flex-row  md:justify-between pb-4 border-b border-b-gray-50 items-center gap-4">
            <h2 className="font-medium text-zinc-500 text-lg w-full md:w-auto">
              Registros ({total})
            </h2>{" "}
            <div className="w-full md:w-auto flex justify-end">
            <AddButton text="Agregar Suscripción" onClick={handleAdd} />
            </div>
          </div>

            <SelectRows
              pageSize={pageSize.toString()}
              handlePageSizeChange={handlePageSizeChange}
            />
          <div className=" overflow-x-auto mt-4">
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
      <ConfirmModal
        openModal={deleteModal}
        setOpenModal={() => setDeleteModal(false)}
        onAction={onDelete}
        title="Eliminar Subscripción"
      />
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
