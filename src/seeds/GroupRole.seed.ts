import { DataSource } from "typeorm";
import { GroupRole } from "../entity/GroupRole";

export const seedGroupRoles = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(GroupRole);

  const count = await repo.count();
  if (count > 0) {
    console.log("GroupRoles already seeded");
    return;
  }

  const groupRoles = [
    {
      name: "ADMIN",
      displayName: "Quản trị viên",
      description: "Toàn quyền hệ thống",
      isDeleted: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "CANDIDATE",
      displayName: "Ứng viên",
      description: "Người dùng thông thường",
      isDeleted: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "COMPANY",
      displayName: "Nhà tuyển dụng",
      description: "Quản lý nội dung & người dùng",
      isDeleted: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await repo.save(groupRoles);
  console.log("Seeded GroupRoles successfully");
};
