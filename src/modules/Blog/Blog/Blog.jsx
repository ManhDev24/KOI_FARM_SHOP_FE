import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import BlogApi from "../../../apis/Blog.api";
import LoadingModal from "../../Modal/LoadingModal";

const Blog = () => {
 
  const data = {
    id: 1,
    image:
      "https://firebasestorage.googleapis.com/v0/b/koi-shop-3290e.appspot.com/o/ca-koi-bi-loi-mat.webp?alt=media&token=9ab791dd-a802-4ec6-814d-c59813cefa95",
    title: "Nguyên nhân cá Koi mất sắc tố và cách khắc phục",
    content: `
                Bên cạnh việc thiếu ánh sáng tự nhiên và dinh dưỡng không đầy đủ, stress cũng là một nguyên nhân phổ biến khiến cá Koi mất sắc tố. 
                Môi trường sống của cá Koi cần phải ổn định và thoải mái. Các yếu tố gây stress cho cá như sự thay đổi đột ngột của nhiệt độ nước, 
                môi trường nước bị ô nhiễm hoặc tình trạng bơi lội quá đông đúc đều có thể làm cho cá Koi mất màu. Hãy đảm bảo rằng cá của bạn được 
                nuôi trong một môi trường có diện tích đủ rộng, nước được lọc thường xuyên và nhiệt độ ổn định, dao động từ 20 đến 25 độ C .

                Ngoài ra, việc chọn giống cá Koi cũng đóng vai trò quan trọng trong việc duy trì sắc tố. Một số giống cá có di truyền kém về màu sắc 
                sẽ dễ bị mất màu theo thời gian, đặc biệt nếu chúng không được chăm sóc đúng cách. Khi mua cá, bạn nên lựa chọn những giống cá khỏe mạnh, 
                có nguồn gốc rõ ràng và đặc biệt là có màu sắc rực rỡ ngay từ đầu. Các chuyên gia khuyến cáo rằng bạn nên tham khảo ý kiến của người nuôi 
                cá Koi chuyên nghiệp hoặc những người bán cá uy tín để lựa chọn giống cá tốt nhất .
    
                Một mẹo nhỏ khác để giữ màu cho cá là thường xuyên cung cấp các loại thức ăn chuyên dụng dành cho cá Koi, đặc biệt là những loại chứa 
                nhiều vitamin và khoáng chất như vitamin C, E, canxi, và phốt pho. Những dưỡng chất này không chỉ giúp tăng cường sức khỏe mà còn duy trì 
                màu sắc tươi sáng của cá. Đừng quên bổ sung thực phẩm tươi sống như giun, tôm, hoặc các loại thực vật giàu dưỡng chất để cá luôn có một 
                chế độ ăn phong phú và cân bằng .
    
                Việc chăm sóc và nuôi dưỡng cá Koi không chỉ dừng lại ở việc cho ăn đúng cách và giữ môi trường sạch sẽ, mà còn đòi hỏi sự quan tâm đến 
                nhiều yếu tố khác như ánh sáng, thức ăn, và sức khỏe tổng thể của cá. Nếu phát hiện cá Koi mất màu hoặc xuất hiện các dấu hiệu bất thường, 
                hãy xem xét toàn diện các yếu tố ảnh hưởng và có biện pháp xử lý kịp thời.
    
                Một khi bạn chú trọng đến tất cả những yếu tố này, cá Koi của bạn sẽ không chỉ lấy lại màu sắc ban đầu mà còn phát triển mạnh mẽ, sống 
                lâu hơn và trở nên một phần quan trọng, đầy màu sắc trong hồ cá của bạn .
            `,
  };

  return (
    <div className="mb-10 me-20 ms-20">
      <div className="flex flex-col justify-center items-center mx-auto w-1/2">
        <h1 className="text-start mb-5 text-3xl w-full text-[#efa709]">
          {data.title}
        </h1>
        <img className="mb-5 w-full  " src={data.image} alt="" />
        {data.content.split("\n\n").map((paragraph, index) => (
          <p key={index} className="text-xl mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Blog;
