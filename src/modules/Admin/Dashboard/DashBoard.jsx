import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { AccountApi } from "../../../apis/Account.api";
import orderApi from "../../../apis/Order.api";
import FishApi from "../../../apis/Fish.api";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import DashBoardApi from "../../../apis/DashBoard.api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import { Bar, Line } from "react-chartjs-2";
import { getLocalStorage } from "../../../utils/LocalStorage";
import { useNavigate } from "react-router-dom";
const DashBoard = () => {
  const user = getLocalStorage("user");
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role !== "manager") {
      navigate("/admin/fish-management");
    }
  });
  const {
    data: totalAccount,
    isLoading: isLoadingTotalAccount,
    isError: isErrorTotalAccount,
  } = useQuery({
    queryKey: ["totalAccount"],
    queryFn: () => AccountApi.totalAccount(),
  });
  const {
    data: totalOrder,
    isLoading: isLoadingTotalOrder,
    isError: isErrorTotalOrder,
  } = useQuery({
    queryKey: ["totalOrder"],
    queryFn: () => orderApi.totalOrder(),
  });
  const {
    data: totalKoiFish,
    isLoading: isLoadingTotalKoiFish,
    isError: isErrorTotalKoiFish,
  } = useQuery({
    queryKey: ["totalKoiFish"],
    queryFn: () => FishApi.totalKoiFish(),
  });
  const {
    data: totalBatchFish,
    isLoading: isLoadingTotalBatchFish,
    isError: isErrorTotalBatchFish,
  } = useQuery({
    queryKey: ["totalBatchFish"],
    queryFn: () => FishApi.totalBatchFish(),
  });
  const {
    data: revenueOfYear,
    isLoading: isLoadingRevenueOfYear,
    isError: isErrorRevenueOfYear,
  } = useQuery({
    queryKey: ["revenueOfYear"],
    queryFn: () => DashBoardApi.revenueOfYear(),
  });

  const {
    data: revenueOfMonth,
    isLoading: isLoadingRevenueOfMonth,
    isError: isErrorRevenueOfMonth,
  } = useQuery({
    queryKey: ["revenueOfMonth"],
    queryFn: () => DashBoardApi.revenueOfMonth(),
  });
  if (
    isLoadingTotalAccount ||
    isLoadingTotalOrder ||
    isLoadingTotalKoiFish ||
    isLoadingTotalBatchFish ||
    isLoadingRevenueOfYear ||
    isLoadingRevenueOfMonth
  ) {
    <div className="h-[800px] w-full flex items-center justify-center items-center">
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </div>;
  }
  if (
    isErrorTotalAccount ||
    isErrorTotalOrder ||
    isErrorTotalKoiFish ||
    isErrorTotalBatchFish ||
    isErrorRevenueOfYear ||
    isErrorRevenueOfMonth
  ) {
    return <div>Error</div>;
  }
  const years = revenueOfYear?.data?.map((item) => item[0]);
  const revenuesOfYear = revenueOfYear?.data?.map((item) => item[1]);
  const months = revenueOfMonth?.data?.map((item) => item[0]);
  const revenuesOfMonth = revenueOfMonth?.data?.map((item) => item[1]);
  const dataOfYear = {
    labels: years,
    datasets: [
      {
        label: "Revenue (VND)",
        data: revenuesOfYear,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };
  const dataOfMonth = {
    labels: months,
    datasets: [
      {
        label: "Revenue (VND)",
        data: revenuesOfMonth,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        fill: false, // Không đổ màu dưới đường
      },
    ],
  };

  const optionsOfYear = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Annual Revenue",
      },
    },
  };

  const optionsOfMonth = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Annual Revenue",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  return (
    <div>
      <div className="top w-full h-[360px]">
        <div className="grid grid-cols-7 grid-rows-9 gap-4 h-full">
          <div className="col-span-2 row-span-3 col-start-2 ">
            <div
              style={{
                border: "1px solid #FFFFFF ",
                borderRadius: "6px",
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 2px 1px rgba(0, 0, 0, 0.25)",
              }}
              className="flex justify-center items-center h-full"
            >
              <div className="left h-full w-[120px] flex justify-center items-center m-4 ">
                <div
                  style={{
                    border: "1px solid gray",
                    borderRadius: "6px",
                    backgroundColor: "#BAFFD1",
                  }}
                  className="w-full flex justify-center items-center h-[80%]"
                >
                  <svg
                    style={{ color: "#32AA56" }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="3em"
                    height="3em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M20 2H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-6 2.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5zM19 15H9v-.25C9 12.901 11.254 11 14 11s5 1.901 5 3.75V15z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M4 8H2v12c0 1.103.897 2 2 2h12v-2H4V8z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="right w-full flex flex-col justify-center items-start">
                <h2 className="text-red-600 text-xl font-semibold mt-1 mb-3">
                  Tổng Khách hàng
                </h2>
                <h3 className="text-lg font-bold m-0">
                  {totalAccount?.data} khách hàng
                </h3>
              </div>
            </div>
          </div>
          <div className="col-span-2 row-span-3 col-start-5">
            <div
              style={{
                border: "1px solid #FFFFFF ",
                borderRadius: "6px",
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 2px 1px rgba(0, 0, 0, 0.25)",
              }}
              className="flex justify-center items-center h-full"
            >
              <div className="left h-full w-[120px] flex justify-center items-center m-4 ">
                <div
                  style={{
                    border: "1px solid gray",
                    borderRadius: "6px",
                    backgroundColor: "#f47074",
                  }}
                  className="w-full flex justify-center items-center h-[80%]"
                >
                  <svg
                    style={{ color: "#ed1c24" }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="3em"
                    height="3em"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M443.9 30.89c-15.7 2.5-30.9 5.3-44 9.58c-13.5 4.4-24.9 10.12-33.7 18.09c17.2 3.33 34.3 8.43 50.1 15.3c.1-.58.3-1.16.4-1.73c1.9-7.79 6-14.79 10.8-21.53c4.9-6.76 10.7-13.35 16.4-19.71M317.8 71.93c-19.2.15-37.3 3.03-52 8.63c-20.9 7.95-34.6 20.54-38.8 38.94c-.9 3.8.2 13.1 5 23.5s12.9 22.1 24 32.5c22.1 20.8 55.5 36.7 100.3 29.9c20.5-3.1 37.4 3.2 47.2 16c9.8 12.9 13.2 30.5 13.4 50.3c.5 32.7-8.1 72.3-18.9 109.2c77.8-53.4 109.2-156.9 77.4-231.8c-17.5-41.1-75.9-69.75-132.7-75.89c-7-.77-14.1-1.17-21-1.27h-3.9zM61.39 84.51c-1.86 22.09-.41 44.59 2.78 66.19c10.85-12 23.14-23 36.73-32.6c-13.59-7.7-26.79-18.81-39.51-33.59m240.01 2.15a9.875 10.38 69.37 0 1 .1 0a9.875 10.38 69.37 0 1 9.3 5.94a9.875 10.38 69.37 0 1-5.8 13.1a9.875 10.38 69.37 0 1-13.4-5.1a9.875 10.38 69.37 0 1 5.8-13.11a9.875 10.38 69.37 0 1 4-.83m36 41.44c27.8 5.3 58.8 9.2 83.5 26.3s40.9 47.8 38.9 99.8l-18-.6c1.9-48.3-11.4-70.7-31.1-84.4c-19.8-13.7-48.3-18.1-76.7-23.5zm-160.6 1.8c-14.6 2.6-29.3 3-43.8.2c-5.1 17-9.8 34.7-13.3 51.9c20.4-14.7 40-32.6 57.1-52.1m-62.8 1.2C36.23 184.5 4.78 288 36.58 362.9c17.52 41.2 75.92 69.8 132.62 75.9c28.4 3.1 56.1.6 77-7.3c20.9-8 34.6-20.6 38.8-39c.9-3.8-.2-13.1-5-23.5s-12.9-22.1-24-32.5c-22.1-20.8-55.5-36.7-100.4-29.9c-20.4 3.1-37.3-3.2-47.1-16c-9.8-12.9-13.2-30.5-13.4-50.3c-.5-32.7 8.1-72.3 18.9-109.2m163.8 15.1a9.875 10.38 69.37 0 1 9.3 6a9.875 10.38 69.37 0 1-5.7 13.1a9.875 10.38 69.37 0 1-13.4-5.2a9.875 10.38 69.37 0 1 5.7-13a9.875 10.38 69.37 0 1 4.1-.9m87 76.4c-1.8.1-3.8.3-5.8.6c-15.3 2.3-29.6 2.2-42.8.3c8.4 19 26 34.7 45.5 49c-.8-6.8-1.6-13.9-1.7-21.2c-.1-9.2 1.1-19.1 4.8-28.7m-214.5 16.9c.8 6.8 1.6 13.9 1.7 21.2c.1 9.2-1.1 19.1-4.8 28.7c1.8-.1 3.8-.3 5.8-.6c15.3-2.3 29.6-2.2 42.8-.3c-8.4-19-26-34.7-45.5-49m-98.12 18.3l17.98.6c-1.85 48.3 11.4 70.7 31.14 84.4c19.8 13.7 48.3 18.1 76.7 23.5l-3.4 17.6c-27.8-5.3-58.8-9.2-83.5-26.3s-40.92-47.8-38.92-99.8M392.3 330c-20.4 14.7-40 32.6-57.1 52.1c14.6-2.6 29.3-3 43.8-.2c5.1-17 9.8-34.7 13.3-51.9m-157.6 15.9a9.875 10.38 69.37 0 1 9.4 5.9a9.875 10.38 69.37 0 1-5.8 13.1a9.875 10.38 69.37 0 1-13.4-5.1a9.875 10.38 69.37 0 1 5.8-13.1a9.875 10.38 69.37 0 1 4-.8m213.1 15.4c-10.8 12-23.1 23-36.7 32.6c13.6 7.8 26.8 18.8 39.5 33.6c1.9-22.1.4-44.5-2.8-66.2m-236.9 44.2a9.875 10.38 69.37 0 1 .1 0a9.875 10.38 69.37 0 1 9.3 5.9a9.875 10.38 69.37 0 1-5.8 13.1a9.875 10.38 69.37 0 1-13.4-5.1a9.875 10.38 69.37 0 1 5.8-13.1a9.875 10.38 69.37 0 1 4-.8M95.7 438.2c-.1.5-.3 1.1-.4 1.7c-1.9 7.8-5.95 14.8-10.8 21.5c-4.87 6.8-10.62 13.3-16.32 19.7c15.62-2.5 30.82-5.3 43.92-9.6c13.5-4.4 24.9-10.1 33.7-18c-17.2-3.4-34.3-8.5-50.1-15.3"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="right w-full flex flex-col justify-center items-start">
                <h2 className="text-red-600 text-xl font-semibold mt-1 mb-3">
                  Tổng số cá Koi
                </h2>
                <h3 className="text-lg font-bold m-0">
                  {totalKoiFish?.data} con đang bán
                </h3>
              </div>
            </div>
          </div>
          <div className="col-span-2 row-span-3 col-start-2 row-start-4">
            <div
              style={{
                border: "1px solid #FFFFFF ",
                borderRadius: "6px",
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 2px 1px rgba(0, 0, 0, 0.25)",
              }}
              className="flex justify-center items-center h-full"
            >
              <div className="left h-full w-[120px] flex justify-center items-center m-4 ">
                <div
                  style={{
                    border: "1px solid gray",
                    borderRadius: "6px",
                    backgroundColor: "#FDDFC3",
                  }}
                  className="w-full flex justify-center items-center h-[80%]"
                >
                  <svg
                    style={{ color: "#FF8B00" }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="3em"
                    height="3em"
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                    >
                      <path d="m11 10.242l1.034 1.181c.095.109.266.1.35-.016l2.1-2.907M16.5 21a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m-8 0a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3"></path>
                      <path d="M3.71 5.4h15.214c1.378 0 2.373 1.27 1.995 2.548l-1.654 5.6C19.01 14.408 18.196 15 17.27 15H8.112c-.927 0-1.742-.593-1.996-1.452zm0 0L3 3"></path>
                    </g>
                  </svg>
                </div>
              </div>
              <div className="right w-full flex flex-col justify-center items-start">
                <h2 className="text-red-600 text-xl font-semibold mt-1 mb-3">
                  Tổng Số đơn hàng
                </h2>
                <h3 className="text-lg font-bold m-0">
                  {totalOrder?.data} đơn hàng trong tháng
                </h3>
              </div>
            </div>
          </div>
          <div className="col-span-2 row-span-3 col-start-5 row-start-4">
            <div
              style={{
                border: "1px solid #FFFFFF ",
                borderRadius: "6px",
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 2px 1px rgba(0, 0, 0, 0.25)",
              }}
              className="flex justify-center items-center h-full"
            >
              <div className="left h-full w-[120px] flex justify-center items-center m-4 ">
                <div
                  style={{
                    border: "1px solid gray",
                    borderRadius: "6px",
                    backgroundColor: "#BAFFD1",
                  }}
                  className="w-full flex justify-center items-center h-[80%]"
                >
                  <svg
                    style={{ color: "#32AA56" }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="3em"
                    height="3em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M20 2H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-6 2.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5zM19 15H9v-.25C9 12.901 11.254 11 14 11s5 1.901 5 3.75V15z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M4 8H2v12c0 1.103.897 2 2 2h12v-2H4V8z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="right w-full flex flex-col justify-center items-start">
                <h2 className="text-red-600 text-xl font-semibold mt-1 mb-3">
                  Tổng số lô cá đang bán
                </h2>
                <h3 className="text-lg font-bold m-0">
                  {totalBatchFish?.data} lô đang bán
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom h-[400px] w-full flex">
        <div className="flex-1 flex justify-center items-center">
          <Bar
            data={dataOfYear}
            options={optionsOfYear}
            width={500}
            height={300}
          />
        </div>
        <div className="flex-1 flex justify-center items-center">
          <Line
            data={dataOfMonth}
            options={optionsOfMonth}
            width={500}
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
