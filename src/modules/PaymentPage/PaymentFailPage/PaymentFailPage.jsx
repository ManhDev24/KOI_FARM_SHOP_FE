import { Button, Steps } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const PaymentFailPage = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("paymentStatus");
  const navigate = useNavigate();
  useEffect(() => {
    if (status !== "0") {
      navigate("/");
    }
  });
  const typePayment = useSelector((state) => state.type.typePayment);
  const description = "Chính sách ký gửi";
  const description1 = "Điền thông tin ký gửi";
  const description2 = "Trạng thái duyệt đơn ký gửi";
  const description3 = "Thanh toán";
  const description4 = "Hoàn tất";
  return (
    <>
      {console.log(typePayment + 'ahsbdknjlkmasdsaoodnjhbgaksbjsakjn')}
      {typePayment === 'true'

        ?
        <>
          < div className="flex  flex-col items-center justify-center h-[600px] w-full">
            <div className="text-center text-3xl font-bold ">
              <h1>Thanh toán thất bại quay lại trang!!!</h1>
            </div>
            <div className="flex justify-center items-center">
              <Button
                style={{ backgroundColor: "#FA4444", color: "white" }}
                className="p-5"
              >
                <Link to="/cart">Đi đến giỏ hàng</Link>
              </Button>
              <Button className="ms-3 p-5">
                <Link to="/">Quay về trang chủ</Link>
              </Button>
            </div>
          </div >
        </>
        :
        <>
          <div class="w-full max-w-[950px] h-full relative mx-auto my-0 p-4">
            <Steps current={3} status="error">
              <Steps title="&nbsp;" description={description} />
              <Steps title="&nbsp;" description={description1} />
              <Steps title="&nbsp;" description={description2} />
              <Steps title="&nbsp;" description={description3} />
              <Steps title="&nbsp;" description={description4} />
            </Steps>

          </div>
          < div className="flex  flex-col items-center justify-center h-[600px] w-full">
            <div className="text-center text-3xl font-bold ">
              <h1>Thanh toán ký gửi thất bại quay lại trang!!!</h1>
            </div>
            <div className="flex justify-center items-center">
              <Button
                style={{ backgroundColor: "#FA4444", color: "white" }}
                className="p-5"
              >
                <Link to="/status-consignment">Quay lại</Link>
              </Button>
              <Button className="ms-3 p-5">
                <Link to="/">Quay về trang chủ</Link>
              </Button>
            </div>
          </div >

        </>
      }
    </>
  );
};

export default PaymentFailPage;
