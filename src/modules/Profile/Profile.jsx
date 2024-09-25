import { Breadcrumb, Button } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
  return (
    <>
      <div className='w-full '>
        <div className='w-[950px] mx-auto my-0'>
          <Breadcrumb
            separator=">"
            className="flex  items-center font-bold text-lg m-3"
          >
            <Breadcrumb.Item>
              <Link to="/" style={{ color: "#EA4444" }} className="">
                Trang chủ
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link style={{ color: "#EA4444" }} className="">
                Thông tin cá nhân
              </Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className='w-full flex justify-center ' >
        <div className="w-[1250px] h-[712px] pl-[37px] pr-14 py-[71px] shadow  gap-[23px] flex justify-center items-center col-span-2">
          {/* avatar
           */}
          <div className="w-full h-full flex flex-col items-end pt-[15px] rounded-[10px] ">
            <div className="w-full h-[50px] ">
              <div className="text-black text-2xl h-[50px] flex items-center   font-['Arial'] ps-2 shadow">Ảnh Đại Diện</div>
            </div>
            <div className="w-full h-[315px] bg-white shadow flex justify-center items-center" >
              <div className='flex flex-col'>
                <img src="./img/avatar.svg" alt="" className="inline-block h-[200px] w-[200px] rounded-full ring-2 ring-lime-100" />

                <div className='mt-10'>
                  <div className="w-full flex justify-center text-black text-xl font-bold font-['Arial']">
                    <Button>
                      Tải ảnh lên
                      <img src="./img/uploadavt.png" alt="" height={25} width={25} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* info */}
          <div className="w-[699px] h-[570px] mt-[30px] relative flex-col flex shadow">

            <div className="w-[654px]  ">
              <div className="text-black text-2xl h-[50px] flex items-center w-full ms-2  font-['Arial']">Thông tin cá nhân</div>
            </div>
            <div className="h-[579px] px-[62px] py-9 pt-0 flex-col justify-start items-start gap-1 inline-flex">
              <div className="w-[486px]">
                <div className="w-[486px] flex-row justify-start items-start inline-flex">
                  <div className="text-black text-xl  font-['Arial'] w-full">Họ và tên:</div>

                  <div className="text-black text-xl  font-['Arial'] col w-full">Hoàng Tiến Đạt
                  </div>
                  <div className=' w-full flex justify-end'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" >
                      <path d="M17.8383 6.75703L16.1203 5.03906L7.61953 13.5375L7.25391 15.6234L9.3375 15.2555L17.8383 6.75703Z" fill="#EA4444" fill-opacity="0.15" />
                      <path d="M20.625 19.5938H3.375C2.96016 19.5938 2.625 19.9289 2.625 20.3438V21.1875C2.625 21.2906 2.70937 21.375 2.8125 21.375H21.1875C21.2906 21.375 21.375 21.2906 21.375 21.1875V20.3438C21.375 19.9289 21.0398 19.5938 20.625 19.5938ZM6.03984 17.625C6.08672 17.625 6.13359 17.6203 6.18047 17.6133L10.1227 16.9219C10.1695 16.9125 10.2141 16.8914 10.2469 16.8563L20.182 6.92109C20.2038 6.89941 20.221 6.87366 20.2328 6.8453C20.2445 6.81695 20.2506 6.78656 20.2506 6.75586C20.2506 6.72516 20.2445 6.69477 20.2328 6.66642C20.221 6.63806 20.2038 6.61231 20.182 6.59063L16.2867 2.69297C16.2422 2.64844 16.1836 2.625 16.1203 2.625C16.057 2.625 15.9984 2.64844 15.9539 2.69297L6.01875 12.6281C5.98359 12.6633 5.9625 12.7055 5.95312 12.7523L5.26172 16.6945C5.23892 16.8201 5.24707 16.9493 5.28545 17.071C5.32384 17.1927 5.39132 17.3032 5.48203 17.393C5.63672 17.543 5.83125 17.625 6.03984 17.625ZM7.61953 13.5375L16.1203 5.03906L17.8383 6.75703L9.3375 15.2555L7.25391 15.6234L7.61953 13.5375Z" fill="#EA4444" />
                    </svg>
                  </div>

                </div>
              </div>
              <div className="w-[486px] ">
                <div className="w-[486px]   flex justify-start items-start ">
                  <div className="text-black text-xl w-full font-['Arial']">Email:</div>
                  <div className="text-black text-base w-full font-['Arial']">dathtse170150@fpt.edu.vn
                  </div>
                  <div className=' w-full flex justify-end'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" >
                      <path d="M17.8383 6.75703L16.1203 5.03906L7.61953 13.5375L7.25391 15.6234L9.3375 15.2555L17.8383 6.75703Z" fill="#EA4444" fill-opacity="0.15" />
                      <path d="M20.625 19.5938H3.375C2.96016 19.5938 2.625 19.9289 2.625 20.3438V21.1875C2.625 21.2906 2.70937 21.375 2.8125 21.375H21.1875C21.2906 21.375 21.375 21.2906 21.375 21.1875V20.3438C21.375 19.9289 21.0398 19.5938 20.625 19.5938ZM6.03984 17.625C6.08672 17.625 6.13359 17.6203 6.18047 17.6133L10.1227 16.9219C10.1695 16.9125 10.2141 16.8914 10.2469 16.8563L20.182 6.92109C20.2038 6.89941 20.221 6.87366 20.2328 6.8453C20.2445 6.81695 20.2506 6.78656 20.2506 6.75586C20.2506 6.72516 20.2445 6.69477 20.2328 6.66642C20.221 6.63806 20.2038 6.61231 20.182 6.59063L16.2867 2.69297C16.2422 2.64844 16.1836 2.625 16.1203 2.625C16.057 2.625 15.9984 2.64844 15.9539 2.69297L6.01875 12.6281C5.98359 12.6633 5.9625 12.7055 5.95312 12.7523L5.26172 16.6945C5.23892 16.8201 5.24707 16.9493 5.28545 17.071C5.32384 17.1927 5.39132 17.3032 5.48203 17.393C5.63672 17.543 5.83125 17.625 6.03984 17.625ZM7.61953 13.5375L16.1203 5.03906L17.8383 6.75703L9.3375 15.2555L7.25391 15.6234L7.61953 13.5375Z" fill="#EA4444" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex-col justify-start items-start flex">
                <div className="w-[486px]  flex">

                  <div className=" text-black text-xl w-full font-['Arial']">Mật khẩu:</div>
                  <div className=" text-black text-xl w-full text-center font-['Arial']">**********

                  </div>
                  <div className=' w-full flex justify-end'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" >
                      <path d="M17.8383 6.75703L16.1203 5.03906L7.61953 13.5375L7.25391 15.6234L9.3375 15.2555L17.8383 6.75703Z" fill="#EA4444" fill-opacity="0.15" />
                      <path d="M20.625 19.5938H3.375C2.96016 19.5938 2.625 19.9289 2.625 20.3438V21.1875C2.625 21.2906 2.70937 21.375 2.8125 21.375H21.1875C21.2906 21.375 21.375 21.2906 21.375 21.1875V20.3438C21.375 19.9289 21.0398 19.5938 20.625 19.5938ZM6.03984 17.625C6.08672 17.625 6.13359 17.6203 6.18047 17.6133L10.1227 16.9219C10.1695 16.9125 10.2141 16.8914 10.2469 16.8563L20.182 6.92109C20.2038 6.89941 20.221 6.87366 20.2328 6.8453C20.2445 6.81695 20.2506 6.78656 20.2506 6.75586C20.2506 6.72516 20.2445 6.69477 20.2328 6.66642C20.221 6.63806 20.2038 6.61231 20.182 6.59063L16.2867 2.69297C16.2422 2.64844 16.1836 2.625 16.1203 2.625C16.057 2.625 15.9984 2.64844 15.9539 2.69297L6.01875 12.6281C5.98359 12.6633 5.9625 12.7055 5.95312 12.7523L5.26172 16.6945C5.23892 16.8201 5.24707 16.9493 5.28545 17.071C5.32384 17.1927 5.39132 17.3032 5.48203 17.393C5.63672 17.543 5.83125 17.625 6.03984 17.625ZM7.61953 13.5375L16.1203 5.03906L17.8383 6.75703L9.3375 15.2555L7.25391 15.6234L7.61953 13.5375Z" fill="#EA4444" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="w-[486px] flex">
                <div className="w-[486px] flex justify-start items-start">
                  <div className="text-black text-xl w-[200px]  font-['Arial']">Địa chỉ:</div>
                  <div className=" text-black text-base w-full font-['Arial']">  299, Tên lửa,Bình Trị Đông B, Bình Tân, TP. Hồ Chí Minh </div>
                  <div className=' w-[50px] flex justify-end'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" >
                      <path d="M17.8383 6.75703L16.1203 5.03906L7.61953 13.5375L7.25391 15.6234L9.3375 15.2555L17.8383 6.75703Z" fill="#EA4444" fill-opacity="0.15" />
                      <path d="M20.625 19.5938H3.375C2.96016 19.5938 2.625 19.9289 2.625 20.3438V21.1875C2.625 21.2906 2.70937 21.375 2.8125 21.375H21.1875C21.2906 21.375 21.375 21.2906 21.375 21.1875V20.3438C21.375 19.9289 21.0398 19.5938 20.625 19.5938ZM6.03984 17.625C6.08672 17.625 6.13359 17.6203 6.18047 17.6133L10.1227 16.9219C10.1695 16.9125 10.2141 16.8914 10.2469 16.8563L20.182 6.92109C20.2038 6.89941 20.221 6.87366 20.2328 6.8453C20.2445 6.81695 20.2506 6.78656 20.2506 6.75586C20.2506 6.72516 20.2445 6.69477 20.2328 6.66642C20.221 6.63806 20.2038 6.61231 20.182 6.59063L16.2867 2.69297C16.2422 2.64844 16.1836 2.625 16.1203 2.625C16.057 2.625 15.9984 2.64844 15.9539 2.69297L6.01875 12.6281C5.98359 12.6633 5.9625 12.7055 5.95312 12.7523L5.26172 16.6945C5.23892 16.8201 5.24707 16.9493 5.28545 17.071C5.32384 17.1927 5.39132 17.3032 5.48203 17.393C5.63672 17.543 5.83125 17.625 6.03984 17.625ZM7.61953 13.5375L16.1203 5.03906L17.8383 6.75703L9.3375 15.2555L7.25391 15.6234L7.61953 13.5375Z" fill="#EA4444" />
                    </svg>
                  </div>
                </div>


              </div>
              <div className="w-[486px] flex">
                <div className="w-[486px]  flex-row justify-start items-start inline-flex">
                  <div className="text-black text-xl w-full font-['Arial']">Số điện thoại:</div>
                  <div className="text-black text-x w-full font-['Arial'] ">098*****13</div>
                  <div className=' w-full flex justify-end'>

                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className='relative' >
                      <path d="M17.8383 6.75703L16.1203 5.03906L7.61953 13.5375L7.25391 15.6234L9.3375 15.2555L17.8383 6.75703Z" fill="#EA4444" fill-opacity="0.15" />
                      <path d="M20.625 19.5938H3.375C2.96016 19.5938 2.625 19.9289 2.625 20.3438V21.1875C2.625 21.2906 2.70937 21.375 2.8125 21.375H21.1875C21.2906 21.375 21.375 21.2906 21.375 21.1875V20.3438C21.375 19.9289 21.0398 19.5938 20.625 19.5938ZM6.03984 17.625C6.08672 17.625 6.13359 17.6203 6.18047 17.6133L10.1227 16.9219C10.1695 16.9125 10.2141 16.8914 10.2469 16.8563L20.182 6.92109C20.2038 6.89941 20.221 6.87366 20.2328 6.8453C20.2445 6.81695 20.2506 6.78656 20.2506 6.75586C20.2506 6.72516 20.2445 6.69477 20.2328 6.66642C20.221 6.63806 20.2038 6.61231 20.182 6.59063L16.2867 2.69297C16.2422 2.64844 16.1836 2.625 16.1203 2.625C16.057 2.625 15.9984 2.64844 15.9539 2.69297L6.01875 12.6281C5.98359 12.6633 5.9625 12.7055 5.95312 12.7523L5.26172 16.6945C5.23892 16.8201 5.24707 16.9493 5.28545 17.071C5.32384 17.1927 5.39132 17.3032 5.48203 17.393C5.63672 17.543 5.83125 17.625 6.03984 17.625ZM7.61953 13.5375L16.1203 5.03906L17.8383 6.75703L9.3375 15.2555L7.25391 15.6234L7.61953 13.5375Z" fill="#EA4444" />
                    </svg>

                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}

export default Profile
