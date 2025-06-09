import { DataSource } from "typeorm";
import { District } from "../entity/District";

export const seedDistricts = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(District);

  const count = await repo.count();
  if (count > 0) {
    console.log("Districts already seeded");
    return;
  }

  const districts = [
    { provinceId: 1, name: "Ba Đình" },
    { provinceId: 1, name: "Hoàn Kiếm" },
    { provinceId: 2, name: "Quận 1" },
    { provinceId: 2, name: "Quận 3" },
    { provinceId: 3, name: "Ngô Quyền" },
    { provinceId: 3, name: "Lê Chân" },
    { provinceId: 4, name: "Ninh Kiều" },
    { provinceId: 4, name: "Bình Thủy" },
    { provinceId: 5, name: "Hải Châu" },
    { provinceId: 5, name: "Thanh Khê" },
    { provinceId: 6, name: "Tân An" },
    { provinceId: 6, name: "Cần Giuộc" },
    { provinceId: 7, name: "Thủ Dầu Một" },
    { provinceId: 7, name: "Dĩ An" },
    { provinceId: 8, name: "Biên Hòa" },
    { provinceId: 8, name: "Long Khánh" },
    { provinceId: 9, name: "Nha Trang" },
    { provinceId: 9, name: "Cam Ranh" },
    { provinceId: 10, name: "TP Thanh Hóa" },
    { provinceId: 10, name: "Bỉm Sơn" },
    { provinceId: 11, name: "Vinh" },
    { provinceId: 11, name: "Cửa Lò" },
    { provinceId: 12, name: "TP Hải Dương" },
    { provinceId: 12, name: "Chí Linh" },
    { provinceId: 13, name: "TP Huế" },
    { provinceId: 14, name: "Đồng Hới" },
    { provinceId: 15, name: "Đông Hà" },
    { provinceId: 16, name: "Hà Tĩnh" },
    { provinceId: 17, name: "TP Bắc Giang" },
    { provinceId: 18, name: "TP Bắc Ninh" },
    { provinceId: 19, name: "TP Thái Bình" },
    { provinceId: 20, name: "TP Nam Định" },
    { provinceId: 21, name: "TP Ninh Bình" },
    { provinceId: 22, name: "TP Vĩnh Yên" },
    { provinceId: 23, name: "TP Hưng Yên" },
    { provinceId: 24, name: "TP Tuy Hòa" },
    { provinceId: 25, name: "Long Xuyên" },
    { provinceId: 26, name: "Mỹ Tho" },
    { provinceId: 27, name: "Vĩnh Long" },
    { provinceId: 28, name: "Trà Vinh" },
    { provinceId: 29, name: "Sóc Trăng" },
    { provinceId: 30, name: "Cà Mau" },
    { provinceId: 31, name: "Bạc Liêu" },
    { provinceId: 32, name: "Vị Thanh" },
    { provinceId: 33, name: "Cao Lãnh" }
  ];

  await repo.save(districts);
  console.log("Seeded Districts successfully");
};
