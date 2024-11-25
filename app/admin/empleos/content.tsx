"use client";
import { MainContainer, SafeAreaContainer } from "@/components/ui/containers";
import SearchInput from "@/components/ui/searchInput";
import { IAdviser, IJobs, IUser } from "@/types/api";
import { apiUrls, pagination } from "@/utils/api/apiUrls";
import { getTokenFromCookie } from "@/utils/api/getToken";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";

import { toast } from "sonner";
import { ConfirmModal, FormModal } from "@/components/ui/modals";
import SelectRows from "@/components/ui/selectRows";
import JobsTable from "@/components/tables/jobsTable";
import JobForm from "@/components/forms/jobForm";
import AddButton from "@/components/ui/addBtn";
import SelectComponent from "@/components/ui/select";

const Content = () => {
  const [token, setToken] = useState("");

  // pagination
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  // data
  const [data, setData] = useState<IJobs[]>([]);

  // loading
  const [loading, setLoading] = useState(false);

  // modal
  const [confirmModal, setConfirmModal] = useState(false);
  const [modal, setModal] = useState(false);

  //search
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [selectedAction, setSelectedAction] = useState<"data" | "search">(
    "data"
  );
  const [modality, setModality] = useState<
    "Remoto" | "Híbrido" | "Prescencial" | "all"
  >("all");

  const [filters, setFilters] = useState<{
    search: string;
    modality: "Remoto" | "Híbrido" | "Prescencial" | "all";
  }>({
    search: "",
    modality: "all",
  });

  const [selectedType, setSelectedType] = useState<"edit" | "create">("create");

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      setToken(token);
    }
  }, []);

  const handleCloseModal = () => {
    setModal(false);
  };

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiUrls.jobs.getAll}?${pagination(pageIndex, pageSize)}`,
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
  const fetchFilteredData = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page: pageIndex,
        per_page: pageSize,
      };
      if (typeof filters.search === "string" && filters.search.trim()) {
        params.like = filters.search.trim();
      }
      console.log(filters.search);
      if (filters.modality !== "all") {
        params.modality = filters.modality;
      }

      const response = await axios.get(apiUrls.jobs.getAll, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });
      setData(response.data.data);
      setPageCount(response.data.last_page);
      setTotal(response.data.total);
      // toast.success("Se obtuvo los datos correctamente");
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

  // const getUserBySearch = (query: string) => {
  //   setSelectedAction("search");
  //   setSearchQuery(query);
  //   setLoading(true);
  //   const promise = new Promise(async (resolve, reject) => {
  //     try {
  //       const res = await axios.get(
  //         apiUrls.jobs.getAll +
  //           "?like=" +
  //           query +
  //           "&" +
  //           pagination(pageIndex, pageSize),
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       setData(res.data.data);
  //       setPageCount(res.data.last_page);
  //       setTotal(res.data.total);
  //       resolve({ message: "Busqueda exitosa" });
  //     } catch (error) {
  //       if (axios.isAxiosError(error)) {
  //         reject({ message: error.response?.data.message });
  //       } else {
  //         reject({ message: "Error al buscar empleo" });
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   });

  //   toast.promise(promise, {
  //     loading: "Buscando empleo...",
  //     success: (data: any) => `${data.message}`,
  //     error: (error: any) => `${error.message}`,
  //   });
  // };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAdd = () => {
    setModal(true);
    setSelectedType("create");
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
  const handleModality = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const modality = event.target.value;
    handleFilterChange("modality", modality);
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setConfirmModal(true);
  };
  const handleOnEdit = (id: number) => {
    setSelectedId(id);
    setSelectedType("edit");
    setModal(true);
  };

  const onDelete = () => {
    if (!selectedId) return;
    const promise = new Promise(async (resolve, reject) => {
      try {
        await axios.delete(apiUrls.jobs.delete(selectedId?.toString()), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resolve({ message: "Empleo eliminado" });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data.message);
          reject({ message: error.response?.data.message });
        } else {
          reject({ message: "No se pudo eliminar el empleo" });
        }
      } finally {
        getData();
        setConfirmModal(false);
      }
    });

    toast.promise(promise, {
      loading: "Eliminando empleo...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };

  useEffect(() => {
    setData([]);
  }, [selectedAction]);

  useEffect(() => {
    if (token) fetchFilteredData();
  }, [token, filters, pageIndex, pageSize]);
  // useEffect(() => {
  //   if (token && selectedAction === "data") {
  //     getData();
  //   }
  // }, [token, selectedAction, pageIndex, pageSize]);

  // useEffect(() => {
  //   if (token && selectedAction === "search") {
  //     getUserBySearch(searchQuery);
  //   }
  // }, [token, selectedAction, pageIndex, pageSize]);

  return (
    <>
      <SafeAreaContainer isTable>
        <div className="mb-4">
          <MainContainer title="Filtros">
            <div className="flex flex-wrap md:flex-row flex-col gap-4 justify-between">
              <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 justify-between">
                <SelectComponent
                  label="Modalidad"
                  id="modality"
                  options={[
                    { value: "all", label: "Todos" },
                    { value: "Remoto", label: "Remoto" },
                    { value: "Híbrido", label: "Híbrido" },
                    { value: "Presencial", label: "Presencial" },
                  ]}
                  onChange={handleModality}
                  defaultValue={""}
                />
              </div>
            </div>
          </MainContainer>
        </div>
        <MainContainer>
          <div className="flex flex-row justify-between pb-4 border-b border-b-gray-50">
            <h2 className="font-medium text-zinc-500 text-lg w-full md:w-auto">
              Registros ({total})
            </h2>
            <div className="w-full md:w-auto flex justify-end">
              <AddButton text="Agregar Empleo" onClick={handleAdd} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-between mb-4 pt-4">
            <SelectRows
              pageSize={pageSize.toString()}
              handlePageSizeChange={handlePageSizeChange}
            />
            <div className="w-full sm:w-auto flex flex-row self-end">
              <SearchInput
                placeholder="Buscar empleo"
                onClick={(query) => handleFilterChange("search", query)}
              />
            </div>
          </div>
          <div className=" overflow-x-auto">
            <JobsTable
              dataTable={data}
              onDelete={(id) => handleDelete(id)}
              onEdit={(id) => handleOnEdit(id)}
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
      {modal && (
        <FormModal
          openModal={modal}
          setOpenModal={setModal}
          title={selectedType === "create" ? "Agregar Empleo" : "Editar Empleo"}
        >
          <JobForm
            closeModal={handleCloseModal}
            type={selectedType}
            id={selectedId}
            token={token}
            getData={getData}
          />
        </FormModal>
      )}
      {selectedId && confirmModal && (
        <ConfirmModal
          openModal={confirmModal}
          setOpenModal={() => setConfirmModal(false)}
          onAction={() => onDelete()}
          title="Eliminar"
          textButton="Confirmar"
          text={`¿Estás seguro de eliminar este empleo?`}
        />
      )}
    </>
  );
};

export default Content;
