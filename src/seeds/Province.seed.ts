import { DataSource } from "typeorm";
import { Province } from "../entity/Province";

export const seedProvinces = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(Province);

  const count = await repo.count();
  if (count > 0) {
    console.log("Provinces already seeded");
    return;
  }

const provinces = [
  { code: 1, name: "Hà Nội" },
  { code: 79, name: "Hồ Chí Minh" },
  { code: 31, name: "Hải Phòng" },
  { code: 92, name: "Cần Thơ" },
  { code: 48, name: "Đà Nẵng" },
  { code: 80, name: "Long An" },
  { code: 74, name: "Bình Dương" },
  { code: 75, name: "Đồng Nai" },
  { code: 56, name: "Khánh Hòa" },
  { code: 38, name: "Thanh Hóa" },
  { code: 40, name: "Nghệ An" },
  { code: 30, name: "Hải Dương" },
  { code: 46, name: "Thừa Thiên Huế" },
  { code: 52, name: "Quảng Bình" },
  { code: 53, name: "Quảng Trị" },
  { code: 42, name: "Hà Tĩnh" },
  { code: 24, name: "Bắc Giang" },
  { code: 27, name: "Bắc Ninh" },
  { code: 36, name: "Thái Bình" },
  { code: 34, name: "Nam Định" },
  { code: 35, name: "Ninh Bình" },
  { code: 26, name: "Vĩnh Phúc" },
  { code: 33, name: "Hưng Yên" },
  { code: 54, name: "Phú Yên" },
  { code: 89, name: "An Giang" },
  { code: 82, name: "Tiền Giang" },
  { code: 83, name: "Vĩnh Long" },
  { code: 84, name: "Trà Vinh" },
  { code: 94, name: "Sóc Trăng" },
  { code: 96, name: "Cà Mau" },
  { code: 95, name: "Bạc Liêu" },
  { code: 93, name: "Hậu Giang" },
  { code: 87, name: "Đồng Tháp" }
];

  await repo.save(provinces);
  console.log("Seeded Provinces successfully");
};
