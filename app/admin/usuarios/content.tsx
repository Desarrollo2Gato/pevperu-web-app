"use client";
import AddButton from "@/app/components/ui/addBtn";
import {
  MainContainer,
  SafeAreaContainer,
} from "@/app/components/ui/containers";
import SearchInput from "@/app/components/ui/searchInput";
import { useAuthContext } from "@/app/context/authContext";
import { IUser } from "@/app/types/api";
import { apiUrls } from "@/app/utils/api/apiUrls";
import { getTokenFromCookie } from "@/app/utils/api/getToken";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Modal, Box, Typography } from "@mui/material";

import UsersTable from "@/app/components/tables/usersTable";
import { toast } from "sonner";
import { ConfirmModal } from "@/app/components/ui/modals";

const Content = () => {
  const [token, setToken] = useState("");

  // pagination
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;
  const [pageCoutn, setPageCount] = useState(0);

  // data
  const [data, setData] = useState<IUser[]>([]);

  // loading
  const [loading, setLoading] = useState(false);

  // modal
  const [confirmModal, setConfirmModal] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

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
        apiUrls.user.pagination(pageIndex, pageSize),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data);
      setData(response.data.data);
      setPageCount(response.data.last_page);
      setTotal(response.data.total);
    } catch (error) {
      toast.error("Error al obtener los datos");
    } finally {
      setLoading(false);
    }
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

  return (
    <>
      <SafeAreaContainer isTable>
        <MainContainer>
          {/* header */}
          <div className="flex flex-row justify-between pb-4 border-b border-b-gray-50">
            <h2>Registros: {total}</h2>{" "}
          </div>
          <div className="flex justify-between mb-4 pt-4">
            <div></div>
            {/* buscador */}
            <div className="flex flex-row self-end">
              <SearchInput />
            </div>
          </div>
          <div className=" overflow-x-auto">
            <UsersTable
              dataTable={data}
              onSuspend={(id) => handleConfirmModal(id, "approved")}
              onUnsuspend={(id) => handleConfirmModal(id, "suspend")}
            />
          </div>
        </MainContainer>
      </SafeAreaContainer>
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
