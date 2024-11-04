
import { Breadcrumb, Steps } from 'antd'

import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const KoiConsignmentPolicies = () => {
    const description = "Chính sách ký gửi";
    const description1 = "Điền thông tin ký gửi";
    const description2 = "Trạng thái duyệt đơn ký gửi";
    const description3 = "Thanh toán";
    const description4 = "Hoàn tất";
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();
    // Hàm xử lý cập nhật currentPage
    const storedValue = JSON.parse(localStorage.getItem('agreedToPolicy'));
    const handleCurrentPage = (prevPage) => {
        localStorage.setItem('agreedToPolicy', true);
        prevPage = 0
        if (prevPage <= 0) {
            setCurrentPage(prevPage => prevPage + 1);
            navigate('/Form-consignment');
        }



    };
    const [statePage, setStatePage] = useState();
    useEffect(() => {
        const dataProfile = JSON.parse(localStorage.getItem('user'));
        const accountId = dataProfile && dataProfile.id ? Number(dataProfile.id) : null;

        if (!accountId) {

            navigate('/login');
        } else if (storedValue) {
            navigate('/Form-consignment');
        }

    }, [navigate]);

    return (
        <>
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
                                Trang chủ
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link style={{ color: "#EA4444" }} className="">
                                Yêu Cầu Ký gửi
                            </Link>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
            <div class="w-full max-w-[950px] h-[89px] relative mx-auto p-4">
                {/* <!-- Lines --> */}
                <div class="w-full max-w-[950px] h-[89px] relative mx-auto my-0 p-4">
                    <Steps current={currentPage} status="process">
                        <Steps title="&nbsp;" description={description} />
                        <Steps title="&nbsp;" description={description1} />
                        <Steps title="&nbsp;" description={description2} />
                        <Steps title="&nbsp;" description={description3} />
                        <Steps title="&nbsp;" description={description4} />
                    </Steps>
                </div>
            </div>
            <div class="form-container w-[950px] mx-auto p-6 bg-white shadow-md rounded-lg my-10">
                <h1 class="text-4xl font-bold text-center text-blue-600 mb-8">Chính Sách Ký Gửi Cá Koi</h1>

                {/* Section 1: Điều Kiện Ký Gửi Cá Koi  */}
                <div class="mb-10">
                    <h3 class="text-2xl font-semibold text-blue-600 mb-4">1. Điều Kiện Ký Gửi Cá Koi</h3>

                    <p class="mb-2"><strong>1.1 Tình Trạng Sức Khỏe Cá Koi:</strong> Cá Koi ký gửi phải đảm bảo tình trạng sức khỏe tốt, không mắc các bệnh truyền nhiễm hoặc các vấn đề sức khỏe nghiêm trọng.</p>
                    <p class="mb-4">Trước chấp nhận ký gửi, chúng tôi sẽ kiểm tra sức khỏe cá Koi. Nếu phát hiện dấu hiệu bệnh hoặc sức khỏe không tốt, chúng tôi có quyền từ chối nhận ký gửi.</p>

                    <p class="mb-2"><strong>1.2 Thông Tin Cá Koi:</strong> Khách hàng cần cung cấp đầy đủ thông tin về cá Koi, bao gồm:</p>
                    <ul class="list-disc ml-6 mb-4">
                        <li>Kích thước (chiều dài, cân nặng)</li>
                        <li>Màu sắc và chủng loại</li>
                        <li>Đặc điểm nhận dạng đặc biệt (nếu có)</li>
                    </ul>

                    <p class="mb-2"><strong>1.3 Cam Kết Từ Khách Hàng:</strong> Khách hàng chịu trách nhiệm về tính chính xác của thông tin cung cấp. Trường hợp thông tin sai lệch, khách hàng sẽ phải chịu trách nhiệm và có thể bị từ chối ký gửi.</p>
                </div>

                {/* Section 2: Chi Phí Ký Gửi Cá Koi Khi Bán  */}
              
                <p class="mb-4">Dịch vụ ký gửi cá Koi của chúng tôi cung cấp hai gói chính: một gói cho việc ký gửi để bán và một gói chỉ dành cho việc chăm sóc cá. Các chi phí được tính dựa trên giá trị của cá tại thời điểm ký gửi.</p>

                {/* <!-- Section 2: Chi Phí Ký Gửi Cá Koi Khi Bán --> */}
                <h3 class="text-2xl font-semibold text-blue-600 mb-4">2. Chi Phí Ký Gửi Cá Koi Để Bán</h3>
                <p class="mb-4">Nếu khách hàng chọn bán cá Koi trong thời gian ký gửi, chúng tôi áp dụng mức phí dịch vụ dựa trên giá trị cá bán. Phí này được tính theo % giá trị bán ra của cá.</p>
                <ul class="list-disc ml-6 mb-4">
                    <li><strong>Gói tháng:</strong> Phí dịch vụ được tính theo tỷ lệ % giá trị bán của cá tại thời điểm đăng ký ký gửi.</li>
                </ul>

                {/* <!-- Section 3: Chi Phí Chăm Sóc Cá Koi (Không Bán Cá) --> */}
                <div class="mb-10">
                    <h3 class="text-2xl font-semibold text-blue-600 mb-4">3. Chi Phí Chăm Sóc Cá Koi (Không Bán Cá)</h3>
                    <p class="mb-4">Nếu khách hàng không bán cá trong quá trình ký gửi và chỉ sử dụng dịch vụ chăm sóc, phí dịch vụ sẽ được tính dựa trên giá trị của cá tại thời điểm ký gửi.</p>
                    <ul class="list-disc ml-6 mb-4">
                        <li><strong>Gói tháng:</strong> Phí dịch vụ được tính theo % giá trị của cá tại thời điểm ký gửi, không phụ thuộc vào việc bán cá.</li>
                    </ul>
                </div>

                <div class="mb-10">
                    <h3 class="text-2xl font-semibold text-blue-600 mb-4">4. Quy Định Về Thanh Toán và Giá Trị Cá</h3>
                    <p class="mb-4"><strong>4.1 Thanh Toán Trước:</strong> Toàn bộ chi phí ký gửi và chăm sóc phải được thanh toán trước khi bắt đầu ký gửi. Quý khách có thể thanh toán qua tiền mặt hoặc chuyển khoản.</p>
                    <p class="mb-4"><strong>4.2 Giá Trị Cá:</strong> Giá trị cá Koi sẽ được định giá và thỏa thuận tại thời điểm ký gửi dựa trên kích thước, chủng loại, và tình trạng sức khỏe.</p>
                    <p class="mb-4"><strong>4.3 Bán Cá:</strong> Nếu khách hàng lựa chọn bán cá trong thời gian ký gửi, phần trăm giá trị cá bán sẽ được khấu trừ theo gói dịch vụ đã chọn khi giao dịch thành công.</p>
                </div>
                <div class="mb-10">
                    <h3 class="text-2xl font-semibold text-blue-600 mb-4">5. Cam Kết Chăm Sóc Cá Koi</h3>
                    <p class="mb-4"><strong>5.1 Chăm Sóc Cá Koi:</strong> Chúng tôi chịu trách nhiệm chăm sóc cá Koi trong suốt thời gian ký gửi, bao gồm chế độ dinh dưỡng, vệ sinh hồ, và theo dõi sức khỏe định kỳ.</p>
                    <p class="mb-4"><strong>5.2 Bồi Thường:</strong> Nếu cá Koi bị mất hoặc tử vong do lỗi của chúng tôi, khách hàng sẽ được bồi thường theo giá trị đã thỏa thuận hoặc thay thế bằng cá Koi tương đương.</p>
                </div>
                <div class="mb-10">
                    <h3 class="text-2xl font-semibold text-blue-600 mb-4">6. Lấy Lại Cá Koi</h3>
                    <p class="mb-4"><strong>6.1 Thông Báo Trước:</strong> Khi hết thời gian ký gửi, khách hàng cần thông báo trước để chúng tôi chuẩn bị cá cho việc bàn giao.</p>
                    <p class="mb-4"><strong>6.2 Gia Hạn và Trách Nhiệm:</strong> Nếu khách hàng không đến nhận cá trong vòng 7 ngày sau khi kết thúc thời gian ký gửi và không có thông báo gia hạn, chúng tôi có quyền xử lý cá theo chính sách của công ty.</p>
                </div>
                <div class="text-center mt-8">
                    <button
                        onClick={() => handleCurrentPage(currentPage)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 transition duration-300"
                    >
                        Đồng ý với chính sách
                    </button>
                </div>
            </div>


        </>
    )
}

export default KoiConsignmentPolicies
