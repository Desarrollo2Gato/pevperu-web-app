"use client";
import { MainContainer, SafeAreaContainer } from "@/components/ui/containers";
import SearchInput from "@/components/ui/searchInput";
import { IAdviser, IUser } from "@/types/api";
import { apiUrls, pagination } from "@/utils/api/apiUrls";
import { getTokenFromCookie } from "@/utils/api/getToken";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";

import { toast } from "sonner";
import { ConfirmModal, FormModal } from "@/components/ui/modals";
import SelectRows from "@/components/ui/selectRows";
import AdviserTable from "@/components/tables/advisersTable";
import AdviserShow from "@/components/info/adviserShow";

const Content = () => {
  const [token, setToken] = useState("");

  // pagination
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  // data
  const [data, setData] = useState<IAdviser[]>([]);

  // loading
  const [loading, setLoading] = useState(false);

  // modal
  const [confirmModal, setConfirmModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  //search
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [selectedAction, setSelectedAction] = useState<"data" | "search">(
    "data"
  );

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
        `${apiUrls.advisor.getAll}?${pagination(pageIndex, pageSize)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data.data.data);
      setData(response.data.data.data);
      setPageCount(response.data.data.last_page);
      setTotal(response.data.data.total);
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
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          apiUrls.advisor.getAll +
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
          reject({ message: error.response?.data.message });
        } else {
          reject({ message: "Error al buscar asesor" });
        }
      } finally {
        setLoading(false);
      }
    });

    toast.promise(promise, {
      loading: "Buscando asesor...",
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

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setConfirmModal(true);
  };
  const handleShow = (id: number) => {
    setSelectedId(id);
    setShowModal(true);
  };
  const onShow = () => {};
  const onDelete = () => {
    if (!selectedId) return;
    const promise = new Promise(async (resolve, reject) => {
      try {
        await axios.delete(apiUrls.advisor.delete(selectedId?.toString()), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resolve({ message: "Asesor eliminado" });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data.message);
          reject({ message: error.response?.data.message });
        } else {
          reject({ message: "No se pudo eliminar el asesor" });
        }
      } finally {
        getData();
        setConfirmModal(false);
      }
    });

    toast.promise(promise, {
      loading: "Eliminando asesor...",
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
            <div className="w-full md:w-auto flex justify-end"></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-between mb-4 pt-4">
            <SelectRows
              pageSize={pageSize.toString()}
              handlePageSizeChange={handlePageSizeChange}
            />
            <div className="w-full sm:w-auto flex flex-row self-end">
              <SearchInput
                placeholder="Buscar asesor"
                onClick={(query) => getUserBySearch(query)}
              />
            </div>
          </div>
          <div className=" overflow-x-auto">
            <AdviserTable
              dataTable={data}
              onDelete={(id) => handleDelete(id)}
              onShow={(id) => handleShow(id)}
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
      {selectedId && showModal && (
        <FormModal
          openModal={showModal}
          setOpenModal={setShowModal}
          title="Información de asesor"
        >
          <AdviserShow
            token={token}
            id={selectedId}
            closeModal={() => setShowModal(false)}
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
          text={`¿Estás seguro de eliminar este asesro?`}
        />
      )}
    </>
  );
};

export default Content;
