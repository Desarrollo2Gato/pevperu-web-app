"use client";
import SubsTable from "../../../components/tables/subsTable";
import { MainContainer, SafeAreaContainer } from "@/components/ui/containers";
import { useEffect, useState } from "react";
import { getTokenFromCookie } from "@/utils/api/getToken";
import axios from "axios";
import { apiUrls } from "@/utils/api/apiUrls";
import { IPlan, ISubscription } from "@/types/api";
import AddButton from "@/components/ui/addBtn";
import SubsForm from "@/components/forms/subsForm";
import SelectRows from "@/components/ui/selectRows";
import { toast } from "sonner";
import { ConfirmModal, FormModal } from "@/components/ui/modals";
import { Pagination } from "@mui/material";
import RenewModal from "@/components/ui/renewModal";
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
  const [data, setData] = useState<ISubscription[]>([]);
  const [plans, setPlans] = useState<IPlan[]>([]);

  // loading
  const [loading, setLoading] = useState(false);

  // modal
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [renewModal, setRenewModal] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<"edit" | "create">("create");


  // filters
  const [planFilter, setPlanFilter] = useState<"all" | string>("all");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [status, setStatus] = useState<"active" | "inactive" | "all">("all");

  const [filters, setFilters] = useState<{
    plan: string;
    status: "active" | "inactive" | "all";
    startDate: Date | null;
    endDate: Date | null;
  }>({
    plan: "all",
    status: "all",
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      setToken(token);
    }
  }, []);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as "active" | "inactive";
    handleFilterChange("status", newStatus);
  };
  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPlan = e.target.value;
    handleFilterChange("plan", newPlan);
  };
  const handleDatesChange = () => {
    if (!startDate || !endDate) return;
    handleFilterChange("date", { startDate, endDate });
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
          reject({ message: error.response?.data.message });
        } else {
          reject({ message: "No se pudo eliminar la suscripción" });
        }
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
      console.log(response);
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

  // filters

  const fetchFilteredData = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page: pageIndex,
        per_page: pageSize,
      };

      if (filters.plan !== "all") params.plan_id = filters.plan;
      if (filters.status !== "all")
        params.is_active = filters.status === "active" ? 1 : 0;
      if (filters.startDate && filters.endDate) {
        params.start_date = filters.startDate.toISOString();
        params.end_date = filters.endDate.toISOString();
      }
      const response = await axios.get(apiUrls.subscription.getAll, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });
      setData(response.data.data);
      setPageCount(response.data.last_page);
      setTotal(response.data.total);
      toast.success("Se obtuvo los datos correctamente");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Error al filtrar los datos");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (token) {
      getPlans();
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchFilteredData();
  }, [token, filters, pageIndex, pageSize]);

  // useEffect(() => {
  //   if (token) fetchFilteredData();
  // }, [token, pageSize, pageIndex]);

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
              // onDelete={(id: number) => handleDelete(id)}
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
