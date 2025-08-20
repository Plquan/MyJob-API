import { DataSource } from "typeorm";
import { Function } from "../entities/function";

export const seedFunctions = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(Function);

  const count = await repo.count();
  if (count > 0) {
    console.log("Funcitons already seeded");
    return;
  }
  const functions = [
    { name: "Quản lý người dùng", codeName: "user_manage" },
    { name: "Quản lý bài viết", codeName: "post_manage" },
    { name: "Xem báo cáo", codeName: "view_reports" },
    { name: "Cấu hình hệ thống", codeName: "system_config" },
  ];


  await repo.save(functions);
  console.log("Seeded Functions successfully");
};
