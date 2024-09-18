import React from "react";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

const ListFish = () => {
  return (
    <div className="ListFish ">
      <div className="filter flex justify-center items-center  mb-5">
        <div
          style={{ backgroundColor: "#FFF8F8" }}
          className="w-[950px] h-[30px] flex items-center ps-3 "
        >
          <Breadcrumb
            separator=">"
            className="flex justify-center items-center font-bold text-lg m-3"
          >
            <Breadcrumb.Item>
              <Link to="/" style={{ color: "#EA4444" }} className="">
                Home
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link style={{ color: "#EA4444" }} className="">
                KoiList
              </Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="flex justify-center items-center mb-3">
        <div
          style={{
            border: "1px solid black",
            borderRadius: "10px",
            boxShadow: "10px 10px 4px 0 rgba(0, 0, 0, 0.25)",
          }}
          className="w-[850px] h-[303px]"
        >
          <div className="m-3">
            <div className="filter name">
              <p className="text-xl font-bold">Tìm kiếm Nâng cao</p> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListFish;
