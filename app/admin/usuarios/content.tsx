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
  const [openModal, setOpenModal] = useState(false);

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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (id: number, status: string) => {
    alert("cambiar estado");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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
              changeStatus={(id, status) => handleChangeStatus(id, status)}
            />
          </div>
        </MainContainer>
      </SafeAreaContainer>
      <div>
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="custom-modal-title"
          aria-describedby="custom-modal-description"
        >
          <Box
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          bg-white border border-gray-300 shadow-lg rounded-lg
          p-4 sm:p-6 
          w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl
          overflow-y-auto max-h-[90vh]"
          >
            <Typography
              id="custom-modal-title"
              variant="h6"
              className="text-2xl text-center font-bold text-zinc-500"
            >
              {selectedType === "create" ? "Crear" : "Editar"} Categoría
            </Typography>
            cambiar de estdo
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default Content;
