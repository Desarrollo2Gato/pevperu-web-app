"use client";
import AddButton from "@/components/ui/addBtn";
import { MainContainer, SafeAreaContainer } from "@/components/ui/containers";
import SearchInput from "@/components/ui/searchInput";
import { ICategory, ICompany, IProduct } from "@/types/api";
import { apiUrls, pagination } from "@/utils/api/apiUrls";
import { getTokenFromCookie } from "@/utils/api/getToken";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import ProductForm from "@/components/forms/productForm";
import ProductTable from "@/components/tables/productTable";
import SelectRows from "@/components/ui/selectRows";
import { toast } from "sonner";
import RejectForm from "@/components/forms/rejectedForm";
import { ConfirmModal, FormModal } from "@/components/ui/modals";
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
  const [data, setData] = useState<IProduct[]>([]);
  const [providers, setProviders] = useState<ICompany[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  // loading
  const [loading, setLoading] = useState(false);

  // modal
  const [openModal, setOpenModal] = useState(false);
  const [rejectedModal, setRejectedModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  //search
  const [searchQuery, setSearchQuery] = useState<string>("");
  // filters
  const [providerFilter, setProviderFilter] = useState<"all" | string>("all");
  const [statusFilter, setStatusFilter] = useState<
    "pending" | "approved" | "rejected" | "all"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | string>("all");

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<"edit" | "create">("create");
  const [selectedStatus, setSelectedStatus] = useState<"delete" | "approved">(
    "delete"
  );
  const [selectedAction, setSelectedAction] = useState<
    "data" | "search" | "status" | "provider" | "category"
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

  const handleCloseModal = () => {
    setOpenModal(false);
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
  const handleEdit = (id: number) => {
    setOpenModal(true);
    setSelectedId(id);
    setSelectedType("edit");
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
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as "pending" | "approved" | "rejected";
    newStatus;
    setStatusFilter(newStatus);
    setSelectedAction("status");
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

  const onApprove = async (id: string) => {
    const promise = new Promise(async (resolve, rejects) => {
      try {
        await axios.post(
          apiUrls.admin.approve("product", id),
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve({ message: "Producto aprobado" });
      } catch (error) {
        // if (axios.isAxiosError(error)) {
        //   console.log(error.response?.data);
        // }
        rejects({ message: "No se pudo aprobar el producto" });
      } finally {
        getData();
        setStatusModal(false);
      }
    });
    toast.promise(promise, {
      loading: "Aprobando producto...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };
  const onDelete = () => {
    if (!selectedId) return;
    const promise = new Promise(async (resolve, reject) => {
      try {
        await axios.delete(apiUrls.product.delete(selectedId?.toString()), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resolve({ message: "Producto eliminado" });
      } catch (error) {
        // if (axios.isAxiosError(error)) {
        //   console.log(error.response?.data);
        // }
        reject({ message: "No se pudo eliminar el producto" });
      } finally {
        getData();
        setStatusModal(false);
      }
    });

    toast.promise(promise, {
      loading: "Eliminando producto...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        apiUrls.product.pagination(pageIndex, pageSize),
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
  const getProductsBySearch = (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          apiUrls.product.getAll +
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
      } catch (error) {
        // if (axios.isAxiosError(error)) {
        //   console.log(error.response?.data);
        // }
        reject({ message: "Error al buscar productos" });
      } finally {
        setLoading(false);
      }
    });

    toast.promise(promise, {
      loading: "Buscando productos...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };
  const getProdByStatus = (
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
          apiUrls.product.getAll +
            "?status=" +
            status +
            `&per_page=${Number(pageSize)}&page=${Number(pageIndex)}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data.data);
        setPageCount(res.data.last_page);
        setTotal(res.data.total);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
          reject({ message: error.response?.data.message });
        } else {
          reject({ message: "Error al filtrar productos por estado" });
        }
      } finally {
        setLoading(false);
      }
    });
    toast.promise(promise, {
      loading: "Filtrando productos...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };
  const getProductsByProvider = async (provider: "all" | string) => {
    if (provider === "all") {
      setSelectedAction("data");
      return;
    }
    setLoading(true);
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          apiUrls.product.myProducts(provider.toString()) +
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
        resolve({ message: "Productos filtrados" });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data.message);
          reject({ message: error.response?.data.message });
        } else {
          reject({ message: "Error al filtrar productos por proveedor" });
        }
      } finally {
        setLoading(false);
      }
    });
    toast.promise(promise, {
      loading: "Filtrando productos...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };
  const getProductsByCategory = async (category: "all" | string) => {
    if (category === "all") {
      setSelectedAction("data");
      return;
    }
    setLoading(true);
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          apiUrls.product.byCategory(category) +
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
        resolve({ message: "Productos filtrados" });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
          reject({ message: error.response?.data.message });
        } else {
          reject({ message: "Error al filtrar productos por categoría" });
        }
      } finally {
        setLoading(false);
      }
    });
    toast.promise(promise, {
      loading: "Filtrando productos...",
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
      getProductsBySearch(searchQuery);
    }
  }, [token, selectedAction, pageIndex, pageSize]);
  useEffect(() => {
    if (token && selectedAction === "status") {
      getProdByStatus(statusFilter);
    }
  }, [token, selectedAction, statusFilter, pageIndex, pageSize]);
  useEffect(() => {
    if (token && selectedAction === "provider") {
      getProductsByProvider(providerFilter);
    }
  }, [token, selectedAction, providerFilter, pageIndex, pageSize]);
  useEffect(() => {
    if (token && selectedAction === "category") {
      getProductsByCategory(categoryFilter);
    }
  }, [token, selectedAction, categoryFilter, pageIndex, pageSize]);
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
            <div className="w-full md:w-auto flex justify-end">
              <AddButton text="Agregar Producto" onClick={handleAdd} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-between mb-4 pt-4">
            <SelectRows
              pageSize={pageSize.toString()}
              handlePageSizeChange={handlePageSizeChange}
            />
            <div className="w-full sm:w-auto flex flex-row self-end">
              <SearchInput
                placeholder="Buscar producto"
                onClick={(query) => getProductsBySearch(query)}
              />
            </div>
          </div>
          <div className=" overflow-x-auto">
            {loading ? (
              <div className="w-full h-10 animate-pulse bg-gray-200"></div>
            ) : (
              <ProductTable
                dataTable={data}
                onDelete={(id: number) => handleStatus(id, "delete")}
                onEdit={(id: number) => handleEdit(id)}
                onApprove={(id: number) => handleStatus(id, "approved")}
                onReject={(id: number) => handleRejected(id)}
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
      {openModal && (
        <FormModal
          title={`${selectedType === "edit" ? "Editar" : "Crear"} producto`}
          openModal={openModal}
          setOpenModal={() => setOpenModal(false)}
        >
          <ProductForm
            closeModal={handleCloseModal}
            type={selectedType}
            id={selectedId}
            token={token}
            getData={getData}
          />
        </FormModal>
      )}

      <ConfirmModal
        openModal={statusModal}
        setOpenModal={() => setStatusModal(false)}
        onAction={handleChangeStatus}
        title={
          selectedStatus === "delete" ? "Eliminar Producto" : "Aprobar Producto"
        }
        text={
          selectedStatus === "delete"
            ? "¿Está seguro que desea eliminar este producto?"
            : "¿Está seguro que desea rechazar este producto?"
        }
        textButton={selectedStatus === "delete" ? "Eliminar" : "Aprobar"}
      />
      {selectedId && (
        <FormModal
          title={`Rechazar producto`}
          openModal={rejectedModal}
          setOpenModal={() => setRejectedModal(false)}
        >
          <RejectForm
            closeModal={() => setRejectedModal(false)}
            type="product"
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
