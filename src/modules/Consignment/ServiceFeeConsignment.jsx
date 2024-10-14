import { useMutation } from '@tanstack/react-query';
import { Button } from 'antd';
import React from 'react'
import { useSelector } from 'react-redux';
import CheckoutApi from '../../apis/Checkout.api';

const ServiceFeeConsignment = () => {
    const serviceFee = useSelector((state) => state.consignment.formData);
    console.log(serviceFee);
    const {
        mutate: handleSaveOrder,
        isLoading: isOrdering,
        isError: isOrderError,
    } = useMutation({
        mutationFn: (data) => CheckoutApi.saveOrder(data),
        onSuccess: (data) => {
            message.success("Đặt hàng thành công");
        },
        onError: (error) => {
            const errorMessage =
                error?.message || "Đã có lỗi xảy ra vui lòng thử lại !!!";
            toast.error(errorMessage);
        },
    });
    const handleOrder = () => {
        handlePayOrderByVnPay(serviceFee);
    };
    const {
        mutate: handlePayOrderByVnPay,
        isLoading: isVnPayLoading,
        isError: isVnPayError,
    } = useMutation({
        mutationFn: (amount) => CheckoutApi.payByVnPay(amount),
        onSuccess: (data) => {
            console.log("data: ", data);

            window.location.assign(data.data.paymentUrl);
        },
        onError: (error) => {
            const errorMessage =
                error?.message || "Đã có lỗi xảy ra vui lòng thử lại !!!";
            toast.error(errorMessage);
        },
    });
    return (
        <div>
            <Button onClick={() => {
                handleOrder();
            }}>thanh toán</Button>
        </div>
    )
}

export default ServiceFeeConsignment
