"use client";
import { MainContainer, SafeAreaContainer } from "@/components/ui/containers";
import SearchInput from "@/components/ui/searchInput";
import { IUser } from "@/types/api";
import { apiUrls, pagination } from "@/utils/api/apiUrls";
import { getTokenFromCookie } from "@/utils/api/getToken";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import { toast } from "sonner";
import { ConfirmModal, FormModal } from "@/components/ui/modals";
import SelectRows from "@/components/ui/selectRows";
import PublisherTable from "@/components/tables/publisherTable";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import PublisherForm from "@/components/forms/publisherForm";

const Content = () => {
  const [token, setToken] = useState("");

  // pagination
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  // data
  const [data, setData] = useState<IUser[]>([]);

  // loading
  const [loading, setLoading] = useState(false);

  // modal
  const [confirmModal, setConfirmModal] = useState(false);

  //search
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const [selectedAction, setSelectedAction] = useState<"data" | "search">(
    "data"
  );

  // modal
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      setToken(token);
    }
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiUrls.user.getAll}?type=extern&${pagination(pageIndex, pageSize)}`,
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

  const getUserBySearch = (query: string) => {
    setSelectedAction("search");
    setSearchQuery(query);
    setLoading(true);
    console.log(
      `${apiUrls.user.getAll}?type=extern&like=${query}&${pagination(
        pageIndex,
        pageSize
      )}`
    );
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          `${apiUrls.user.getAll}?type=extern&like=${query}&${pagination(
            pageIndex,
            pageSize
          )}`,
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
        resolve({ message: "Busqueda exitosa" });
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

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleConfirmModal = async (id: number, status: string) => {
    setSelectedId(id);
    setSelectedStatus(status);
    setConfirmModal(true);
  };

  const handleChangeStatus = async (id: number, status: string) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (status === "suspend") {
          await axios.post(
            apiUrls.admin.approve("user", id.toString()),
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          resolve({ message: "Usuario aprobado" });
        } else {
          await axios.post(
            apiUrls.admin.suspend("user", id.toString()),
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          resolve({ message: "Usuario suspendido" });
        }
        setConfirmModal(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          reject({ message: error.response?.data.message });
        }
        reject({ message: "Error al cambiar el estado" });
      } finally {
        getData();
      }
    });

    toast.promise(promise, {
      loading: "Cambiando estado",
      success: (data: any) => data.message,
      error: (error: any) => error.message,
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

  const handleChangePermisses = (id: number) => {
    setOpenModal(true);
    setSelectedId(id);
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
      getUserBySearch(searchQuery);
    }
  }, [token, selectedAction, pageIndex, pageSize]);

  return (
    <>
      <SafeAreaContainer isTable>
        <MainContainer>
          <div className="flex flex-row justify-between pb-4 border-b border-b-gray-50">
            <h2 className="font-medium text-zinc-500 text-lg w-full md:w-auto">
              Registros ({total})
            </h2>
            <div className="w-full md:w-auto flex justify-end">
              <Link
                href={"/admin/usuarios"}
                className="text-zinc-400 font-medium hover:-translate-x-2 duration-500 transition-all"
              >
                <FaArrowLeftLong className="inline mr-2" />
                Volver
              </Link>
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
                onClick={(query) => getUserBySearch(query)}
              />
            </div>
          </div>
          <div className=" overflow-x-auto">
            <PublisherTable
              dataTable={data}
              onSuspend={(id) => handleConfirmModal(id, "approved")}
              onUnsuspend={(id) => handleConfirmModal(id, "suspend")}
              onChangePermisses={(id) => handleChangePermisses(id)}
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
      {openModal && (
        <FormModal
          title={`Editar Permisos`}
          openModal={openModal}
          setOpenModal={() => setOpenModal(false)}
        >
          <PublisherForm
            closeModal={handleCloseModal}
            type={"edit"}
            id={selectedId}
            token={token}
            getData={getData}
          />
        </FormModal>
      )}
      {selectedId && selectedStatus && (
        <ConfirmModal
          openModal={confirmModal}
          setOpenModal={() => setConfirmModal(false)}
          onAction={() => handleChangeStatus(selectedId!, selectedStatus!)}
          title="Cambiar estado"
          textButton="Confirmar"
          text={`¿Estás seguro de cambiar el estado del usuario?`}
        />
      )}
    </>
  );
};

export default Content;
