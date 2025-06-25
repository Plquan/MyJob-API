import { DataSource } from "typeorm";;
import { PackageType } from "../entity/PackageType";

export const seedPackageTypes = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(PackageType);

  const count = await repo.count();
  if (count > 0) {
    console.log("Package Types already seeded");
    return;
  }
 const packageTypes = [
    {
      code: 'BRANDING',
      name: 'Gói dịch vụ truyền thông',
      description: 'Tăng độ nhận diện thương hiệu, hiển thị nổi bật công ty, quảng bá tin tuyển dụng.',
    },
    {
      code: 'CV_ACCESS',
      name: 'Gói tìm hồ sơ ứng viên',
      description: 'Mở khóa CV, tìm kiếm hồ sơ ứng viên tiềm năng, chủ động tiếp cận ứng viên IT.',
    },
    {
      code: 'RECRUITMENT',
      name: 'Gói đăng tin tuyển dụng',
      description: 'Đăng tin tuyển dụng lên hệ thống, làm mới tin, thêm kỹ năng, top search...',
    },
  ]
  await repo.save(packageTypes);
  console.log("Seeded Package Types successfully");
};
