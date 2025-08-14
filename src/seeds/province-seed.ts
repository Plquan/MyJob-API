import { DataSource } from "typeorm";
import { Province } from "../entities/province";

export const seedProvinces = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(Province);

  const count = await repo.count();
  if (count > 0) {
    console.log("Provinces already seeded");
    return;
  }
  const provinces = [
    { name: "Hà Nội" },
    { name: "Hồ Chí Minh" },
    { name: "Hải Phòng" },
    { name: "Cần Thơ" },
    { name: "Đà Nẵng" },
    { name: "Long An" },
    { name: "Bình Dương" },
    { name: "Đồng Nai" },
    { name: "Khánh Hòa" },
    { name: "Thanh Hóa" },
    { name: "Nghệ An" },
    { name: "Hải Dương" },
    { name: "Thừa Thiên Huế" },
    { name: "Quảng Bình" },
    { name: "Quảng Trị" },
    { name: "Hà Tĩnh" },
    { name: "Bắc Giang" },
    { name: "Bắc Ninh" },
    { name: "Thái Bình" },
    { name: "Nam Định" },
    { name: "Ninh Bình" },
    { name: "Vĩnh Phúc" },
    { name: "Hưng Yên" },
    { name: "Phú Yên" },
    { name: "An Giang" },
    { name: "Tiền Giang" },
    { name: "Vĩnh Long" },
    { name: "Trà Vinh" },
    { name: "Sóc Trăng" },
    { name: "Cà Mau" },
    { name: "Bạc Liêu" },
    { name: "Hậu Giang" },
    { name: "Đồng Tháp" }
  ];

  await repo.save(provinces);
  console.log("Seeded Provinces successfully");
};
