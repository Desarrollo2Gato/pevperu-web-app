"use client";
import AddButton from "@/components/ui/addBtn";
import { MainContainer, SafeAreaContainer } from "@/components/ui/containers";
import SearchInput from "@/components/ui/searchInput";
import { ICategory, ICompany } from "@/types/api";
import { apiUrls, pagination } from "@/utils/api/apiUrls";
import { getTokenFromCookie } from "@/utils/api/getToken";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import CategoryTable from "@/components/tables/categoriesTable";
import CategoryForm from "@/components/forms/categoryForm";
import SelectRows from "@/components/ui/selectRows";
import { ConfirmModal, FormModal } from "@/components/ui/modals";
import { toast } from "sonner";
import FilesTable from "@/components/tables/filesTable";
import SelectComponent from "@/components/ui/select";

const Content = () => {
  const [token, setToken] = useState("");

  // pagination
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  // data
  const [data, setData] = useState<any[]>([]);
  const [providers, setProviders] = useState<ICompany[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  // loading
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // modal
  const [openModal, setOpenModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState<string>("");

  // filters
  const [providerFilter, setProviderFilter] = useState<"all" | string>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | string>("all");

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<"edit" | "create">("create");
  const [selectedAction, setSelectedAction] = useState<
    "data" | "search" | "provider" | "category"
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
      getCategories();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      getData();
    }
  }, [pageIndex, token]);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        apiUrls.product_file.getAll + "?" + pagination(pageIndex, pageSize),
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
  const getCategories = async () => {
    try {
      const response = await axios.get(apiUrls.category.getAll, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      toast.error("Error al obtener categorías");
      console.error(error);
    }
  };
  const getFilesByProvider = async (provider: "all" | string) => {
    if (provider === "all") {
      setSelectedAction("data");
      return;
    }
    setLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          apiUrls.product_file.getAll +
            "?company_id=" +
            provider +
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
        resolve({ message: "Archivos filtrados" });
      } catch (error) {
        // if (axios.isAxiosError(error)) {
        //   console.log(error.response?.data);
        // }
        reject({ message: "Error al filtrar archivos por proveedor" });
      } finally {
        setLoading(false);
      }
    });
    toast.promise(promise, {
      loading: "Filtrando archivos...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };
  const getFilesByCategory = async (category: "all" | string) => {
    if (category === "all") {
      setSelectedAction("data");
      return;
    }
    setLoading(true);
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          apiUrls.product_file.getAll +
            "?category_id=" +
            category +
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
        resolve({ message: "Archivos filtrados" });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
        }
        reject({ message: "Error al filtrar archivos por categoría" });
      } finally {
        setLoading(false);
      }
    });
    toast.promise(promise, {
      loading: "Filtrando archivos...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
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
  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvider = e.target.value as "all" | string;
    newProvider;
    setProviderFilter(newProvider);
    setSelectedAction("provider");
  };
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as "all" | string;
    newCategory;
    setCategoryFilter(newCategory);
    setSelectedAction("category");
  };

  // const handleDelete = (id: number) => {
  //   setSelectedId(id);
  //   setDeleteModal(true);
  // };

  // const onDelete = () => {
  //   if (!selectedId) return;
  //   const promise = new Promise(async (resolve, reject) => {
  //     try {
  //       await axios.delete(apiUrls.category.delete(selectedId?.toString()), {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       resolve({ message: "Archivo eliminado" });
  //     } catch (error) {
  //       if (axios.isAxiosError(error)) {
  //         console.log(error.response?.data);
  //       }
  //       reject({ message: "No se pudo eliminar la archivo" });
  //     } finally {
  //       getData();
  //       setDeleteModal(false);
  //     }
  //   });

  //   toast.promise(promise, {
  //     loading: "Eliminando archivo...",
  //     success: (data: any) => `${data.message}`,
  //     error: (error: any) => `${error.message}`,
  //   });
  // };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const getFilesBySearch = (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          apiUrls.product_file.getAll +
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
        resolve({ message: "Archivos filtradas" });
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
      loading: "Filtrando archivos...",
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
      getFilesBySearch(searchQuery);
    }
  }, [token, selectedAction, searchQuery, pageIndex, pageSize]);
  useEffect(() => {
    if (token && selectedAction === "provider") {
      getFilesByProvider(providerFilter);
    }
  }, [token, selectedAction, providerFilter, pageIndex, pageSize]);
  useEffect(() => {
    if (token && selectedAction === "category") {
      getFilesByCategory(categoryFilter);
    }
  }, [token, selectedAction, categoryFilter, pageIndex, pageSize]);
  return (
    <>
      <SafeAreaContainer isTable>
        <div className="mb-4">
          <MainContainer title="Filtros">
            <div className="flex gap-1 flex-wrap justify-between mb-4 flex-row w-full">
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
              <SelectComponent
                label="Categoría"
                id="categoryFilter"
                options={[
                  { value: "all", label: "Todos" },
                  ...categories.map((category) => ({
                    value: category.id.toString(),
                    label: category.name,
                  })),
                ]}
                onChange={handleCategoryChange}
                defaultValue={categoryFilter}
              />
            </div>
          </MainContainer>
        </div>

        <MainContainer>
          <div className="flex flex-col md:flex-row  md:justify-between pb-4 border-b border-b-gray-50 items-center gap-4">
            <h2 className="font-medium text-zinc-500 text-lg w-full md:w-auto">
              Registros ({total})
            </h2>{" "}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-between mb-4 pt-4">
            <SelectRows
              pageSize={pageSize.toString()}
              handlePageSizeChange={handlePageSizeChange}
            />
            <div className="w-full sm:w-auto flex flex-row self-end">
              <SearchInput
                placeholder="Buscar archivo"
                onClick={(query) => getFilesBySearch(query)}
              />
            </div>
          </div>
          <div className=" overflow-x-auto">
            {loading ? <div>Cargando...</div> : <FilesTable dataTable={data} />}
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
        title={`${selectedType === "edit" ? "Editar" : "Crear"} archivo`}
        openModal={openModal}
        setOpenModal={() => setOpenModal(false)}
      >
        <CategoryForm
          closeModal={handleCloseModal}
          type={selectedType}
          id={selectedId}
          token={token}
          getData={getData}
        />
      </FormModal>
      {/* <ConfirmModal
        openModal={deleteModal}
        setOpenModal={() => setDeleteModal(false)}
        onAction={onDelete}
        title="Eliminar Archivo"
      /> */}
    </>
  );
};

export default Content;
