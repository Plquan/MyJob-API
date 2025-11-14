import { DataSource } from "typeorm"
import { User } from "../entities/user"
import { EUserRole } from "../common/enums/user/user-role-enum"
import Extensions from "../common/ultils/extension"

export const seedAdminUsers = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(User);

  const count = await repo.count({
    where: { role: EUserRole.ADMIN }
  });

  if (count > 0) {
    console.log("Admin users already seeded");
    return;
  }

  const adminUsers = [
    {
      email: 'admin@gmail.com',
      password: Extensions.hashPassword('123'),
      isActive: true,
      isVerifyEmail: true,
      isSuperUser: true,
      isStaff: true,
      role: EUserRole.ADMIN,
    }
  ];

  await repo.save(adminUsers);
  console.log("Seed Admin Users successfully");
};
