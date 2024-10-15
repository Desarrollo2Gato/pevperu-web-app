"use client";
import AddButton from "@/components/ui/addBtn";
import { MainContainer, SafeAreaContainer } from "@/components/ui/containers";
import SearchInput from "@/components/ui/searchInput";
import { ICompany } from "@/types/api";
import { apiUrls, pagination } from "@/utils/api/apiUrls";
import { getTokenFromCookie } from "@/utils/api/getToken";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import SelectRows from "@/components/ui/selectRows";
import { ConfirmModal, FormModal } from "@/components/ui/modals";
import { toast } from "sonner";
import CompanyForm from "@/components/forms/companyForm";
import CompanyTable from "@/components/tables/companiesTable";
import { BiSolidCopy } from "react-icons/bi";
import { BootstrapTooltip } from "@/components/ui/tooltip";

const Content = () => {
  const [token, setToken] = useState("");

  // pagination
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  // data
  const [data, setData] = useState<ICompany[]>([]);

  // loading
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // modal
  const [openModal, setOpenModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<"edit" | "create">("create");
  const [selectedAction, setSelectedAction] = useState<"data" | "search">(
    "data"
  );

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getData();
    }
  }, [pageIndex, token]);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        apiUrls.company.pagination(pageIndex, pageSize),
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
      toast.error("Error al obtener los datos");
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
        await axios.delete(apiUrls.company.delete(selectedId?.toString()), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resolve({ message: "Empresa eliminada" });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
        }
        reject({ message: "No se pudo eliminar la empresa" });
      } finally {
        getData();
        setDeleteModal(false);
      }
    });

    toast.promise(promise, {
      loading: "Eliminando empresa...",
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

  const getCompaniesBySearch = (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          apiUrls.company.getAll +
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
        resolve({ message: "Empresas filtradas" });
      } catch (error) {
        // if (axios.isAxiosError(error)) {
        //   console.log(error.response?.data);
        // }
        reject({ message: "Error" });
      } finally {
        setLoading(false);
      }
    });

    toast.promise(promise, {
      loading: "Filtrando empresas...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };

  useEffect(() => {
    setData([]);
    setPageIndex(1);
  }, [selectedAction]);

  useEffect(() => {
    if (token && selectedAction === "data") {
      getData();
    }
  }, [token, selectedAction, pageIndex, pageSize]);

  // status
  useEffect(() => {
    if (token && selectedAction === "search") {
      getCompaniesBySearch(searchQuery);
    }
  }, [token, selectedAction, searchQuery, pageIndex, pageSize]);

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText("password123");
      toast.success("Contraseña inicial copiada");
    } catch (error) {
      toast.error("Error al copiar la contraseña inicial");
    }
  };
  return (
    <>
      <SafeAreaContainer isTable>
        <MainContainer>
          <div className="flex flex-col md:flex-row  md:justify-between pb-4 border-b border-b-gray-50 items-center gap-4">
            <h2 className="font-medium text-zinc-500 text-lg w-full md:w-auto">
              Registros ({total})
            </h2>{" "}
            <div className="w-full md:w-auto flex justify-end">
              <AddButton text="Agregar Empresa" onClick={handleAdd} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-between mb-4 pt-4">
            <div className="flex gap-4 flex-col sm:flex-row">
              <SelectRows
                pageSize={pageSize.toString()}
                handlePageSizeChange={handlePageSizeChange}
              />
              <div className="w-fit px-4 py-1 rounded-md bg-yellow-50 border border-zinc-100 flex gap-2">
                <span className="text-sm text-zinc-400">password123</span>
                <BootstrapTooltip placement="top" title="Copiar">
                  <button type="button" onClick={handleCopy}>
                    <BiSolidCopy className="text-zinc-400 text-lg" />
                  </button>
                </BootstrapTooltip>
              </div>
            </div>
            <div className="w-full sm:w-auto flex flex-row self-end">
              <SearchInput
                placeholder="Buscar empresa"
                onClick={(query) => getCompaniesBySearch(query)}
              />
            </div>
          </div>
          <div className=" overflow-x-auto">
            {loading ? (
              <div>Cargando...</div>
            ) : (
              <CompanyTable
                dataTable={data}
                onDelete={(id: number) => handleDelete(id)}
                onEdit={(id: number) => handleEdit(id)}
              />
            )}
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
        title={`${selectedType === "edit" ? "Editar" : "Crear"} empresa`}
        openModal={openModal}
        setOpenModal={() => setOpenModal(false)}
      >
        <CompanyForm
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
        title="Eliminar Empresa"
      />
    </>
  );
};

export default Content;
