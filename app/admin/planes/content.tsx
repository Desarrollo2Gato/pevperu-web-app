"use client";
import AddButton from "@/components/ui/addBtn";
import { MainContainer, SafeAreaContainer } from "@/components/ui/containers";
import { IPlan } from "@/types/api";
import { apiUrls } from "@/utils/api/apiUrls";
import { getTokenFromCookie } from "@/utils/api/getToken";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import PlansTable from "@/components/tables/plansTable";
import PlanForm from "@/components/forms/plansForm";
import SelectRows from "@/components/ui/selectRows";
import { ConfirmModal, FormModal } from "@/components/ui/modals";
import { toast } from "sonner";
import Link from "next/link";

const Content = () => {
  // token
  const [token, setToken] = useState("");

  // pagination
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  // data
  const [data, setData] = useState<IPlan[]>([]);

  // loading
  const [loading, setLoading] = useState(false);

  // modal
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<"edit" | "create">("create");

  useEffect(() => {
    //obtener token
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
        apiUrls.plan.pagination(pageIndex, pageSize),
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
      toast.error("No se pudo obtener los planes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getData();
    }
  }, [pageIndex, pageSize]);

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
        await axios.delete(apiUrls.plan.delete(selectedId?.toString()), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        resolve({ message: "Plan eliminado" });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
          reject({ message: error.response?.data.message });
        } else {
          reject({ message: "No se pudo eliminar el plan" });
        }
      } finally {
        getData();
        setDeleteModal(false);
      }
    });

    toast.promise(promise, {
      loading: "Eliminando plan...",
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
    setSelectedId(null);
    setSelectedType("create");
  };
  return (
    <>
      <SafeAreaContainer isTable>
        <MainContainer>
          <div className="flex flex-col md:flex-row  md:justify-between pb-4 border-b border-b-gray-50 items-center gap-4">
            <h2 className="font-medium text-zinc-500 text-lg w-full md:w-auto">
              Registros ({total})
            </h2>{" "}
            <div className="w-full md:w-auto flex justify-end gap-4 flex-wrap">
              <Link
                href={"/admin/planes-empresas-independientes"}
                className="bg-green-800 rounded-md px-4 py-1 text-sm text-white font-medium flex justify-center items-center"
              >
                Planes independientes
              </Link>
              <AddButton text="Agregar Plan" onClick={handleAdd} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-between mb-4 pt-4">
            <SelectRows
              pageSize={pageSize.toString()}
              handlePageSizeChange={handlePageSizeChange}
            />
          </div>
          <div className=" overflow-x-auto">
            <PlansTable
              dataTable={data}
              onDelete={(id: number) => handleDelete(id)}
              onEdit={(id: number) => handleEdit(id)}
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
        title={`${selectedType === "edit" ? "Editar" : "Crear"} plan`}
        openModal={openModal}
        setOpenModal={() => setOpenModal(false)}
      >
        <PlanForm
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
        title="Eliminar Plan"
      />
    </>
  );
};

export default Content;
