import React from "react";
import "./ListBlog.css";
import moment from "moment";

const ListBlog = () => {
  const data = [
    {
      id: 1,
      title: "Cá koi mất sắc tố – Hãy dừng cho ăn ngay!",
      content:
        "Nguyên nhân dẫn đến cá Koi mất sắc tố là khi koi được nuôi trong nhà trong một khoảng thời gian dài, chúng không được tiếp xúc với ánh sáng tự nhiên. Để khắc phục vấn đề này, bạn nên di chuyển cá ra ngoài để tắm nắng và cung cấp những dưỡng chất cần thiết.",
      image:
        "https://firebasestorage.googleapis.com/v0/b/koi-shop-3290e.appspot.com/o/ca-koi-bi-loi-mat.webp?alt=media&token=9ab791dd-a802-4ec6-814d-c59813cefa95",
      date: "2022-05-17",
    },
    {
      id: 2,
      title: "Soi đuôi và vây đuôi của cá koi chất lượng có gì thú vị?",
      content:
        "Đuôi và vây đuôi của cá koi thường là yếu tố bị nhiều người bỏ qua khi lựa chọn koi chất lượng. Tuy nhiên, đó là một trong những yếu tố cần thiết để đánh giá một chú koi đẹp và khoẻ mạnh.",
      image:
        "https://firebasestorage.googleapis.com/v0/b/koi-shop-3290e.appspot.com/o/302244154_466398365506764_1469967525048014852_n.jpg?alt=media&token=cacd99df-a5e3-4f80-990f-38c4aeea2ffd",
      date: "2022-05-16",
    },
    {
      id: 3,
      title: "Tìm hiểu về vây đuôi của cá Koi Nhật Bản",
      content:
        "Như thế nào là một vây đuôi đẹp? Những chiếc vây đuôi hoàn hảo là một trong những yếu tố cần được xem xét kỹ lưỡng khi chọn cá Koi chất lượng.",
      image:
        "https://firebasestorage.googleapis.com/v0/b/koi-shop-3290e.appspot.com/o/21192409_2043061832374346_8040048652543603933_n.jpg?alt=media&token=a3d17122-3370-4fa8-a211-82564b1c2705",
      date: "2022-05-15",
    },
    {
      id: 4,
      title: "Cá koi mát sắc tố – Hãy dừng cho ăn ngay!",
      content:
        "Như thế nào là một vây đuôi đẹp? Những chiếc vây đuôi hoàn hảo là một trong những yếu tố cần được xem xét kỹ lưỡng khi chọn cá Koi chất lượng.",
      image:
        "https://firebasestorage.googleapis.com/v0/b/koi-shop-3290e.appspot.com/o/21192409_2043061832374346_8040048652543603933_n.jpg?alt=media&token=a3d17122-3370-4fa8-a211-82564b1c2705",
      date: "2022-05-14",
    },
  ];

  return (
    <div>
      <div className="text-center text-2xl text-[#196b49]">Tin Hữu ích</div>
      <div className="grid grid-cols-5 grid-rows-8 gap-4 mt-10 mb-20 me-[200px]">
        <div className="col-span-2 row-span-8 col-start-2">
          <img
            className="h-[630px] w-[95%]"
            src={data[0].image}
            alt={data[0].title}
          />
          <h1 className="mt-4 text-[#1A8358] text-xl font-bold">
            {data[0].title}
          </h1>
          <h1>{moment(data[0].date).format("DD [tháng] M [năm], YYYY")}</h1>
        </div>
        <div className="col-span-2 row-span-2 col-start-4">
          <div className="flex">
            <div className="img">
              <img
                className="object-fill h-[200px] w-[300px]"
                src={data[1].image}
              />
            </div>
            <div className="ms-2 w-[300px]">
              <div className="title font-bold text-[#1A8358] text-lg ">
                {data[1].title}
              </div>
              <div className="content">
                <p>{data[1].content.substring(0, 193)}...</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 row-span-2 col-start-4 ">
          <div className="flex">
            <div className="img">
              <img
                className="object-fill h-[200px] w-[300px]"
                src={data[2].image}
              />
            </div>
            <div className="ms-2 w-[300px]">
              <div className="title font-bold text-[#1A8358] text-lg ">
                {data[2].title}
              </div>
              <div className="content">
                <p>{data[2].content.substring(0, 193)}...</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 row-span-2 col-start-4 ">
          <div className="flex">
            <div className="img">
              <img
                className="object-fill h-[200px] w-[300px]"
                src={data[3].image}
              />
            </div>
            <div className="ms-2 w-[300px]">
              <div className="title font-bold text-[#1A8358] text-lg ">
                {data[3].title}
              </div>
              <div className="content">
                <p>{data[3].content.substring(0, 193)}...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListBlog;
