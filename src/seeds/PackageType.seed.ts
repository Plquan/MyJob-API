import { DataSource } from "typeorm";
import { PackageType } from "../entity/PackageType";
import { Feature } from "../entity/Feature";

export const seedPackageTypes = async (dataSource: DataSource) => {
  const packageTypeRepo = dataSource.getRepository(PackageType);
  const featureRepo = dataSource.getRepository(Feature);

  const count = await packageTypeRepo.count();
  if (count > 0) {
    console.log("Package Types already seeded");
    return
  }


  const branding = packageTypeRepo.create({
    code: 'BRANDING',
    name: 'Gói dịch vụ truyền thông',
    description: 'Tăng độ nhận diện thương hiệu, hiển thị nổi bật công ty, quảng bá tin tuyển dụng.',
  })

  const cvAccess = packageTypeRepo.create({
    code: 'CV_ACCESS',
    name: 'Gói tìm hồ sơ ứng viên',
    description: 'Mở khóa CV, tìm kiếm hồ sơ ứng viên tiềm năng, chủ động tiếp cận ứng viên IT.',
  })

  const recruitment = packageTypeRepo.create({
    code: 'RECRUITMENT',
    name: 'Gói đăng tin tuyển dụng',
    description: 'Đăng tin tuyển dụng lên hệ thống, làm mới tin, thêm kỹ năng, top search...',
  })

  await packageTypeRepo.save([branding, cvAccess, recruitment]);

  const features = [
    // Branding features
    {
      code: "BRANDING_BANNER",
      name: "Hiển thị banner thương hiệu",
      description: "Hiển thị banner công ty trên các trang nổi bật",
      allowLimit: false,
      packageType: branding,
    },
    {
      code: "SPONSORED_EMPLOYER",
      name: "Gắn nhãn nhà tuyển dụng nổi bật",
      description: "Giúp tăng độ tin cậy thương hiệu",
      allowLimit: false,
      packageType: branding,
    },

    // CV_ACCESS features
    {
      code: "VIEW_CV",
      name: "Xem CV ứng viên",
      description: "Xem và tải CV ứng viên trong hệ thống",
      allowLimit: true,
      packageType: cvAccess,
    },
    {
      code: "SEARCH_CANDIDATE",
      name: "Tìm kiếm ứng viên",
      description: "Sử dụng bộ lọc tìm ứng viên phù hợp",
      allowLimit: false,
      packageType: cvAccess,
    },

    // Recruitment features
    {
      code: "POST_JOB",
      name: "Đăng tin tuyển dụng",
      description: "Đăng bài tuyển dụng lên hệ thống",
      allowLimit: true,
      packageType: recruitment,
    },
    {
      code: "TAG_SKILL",
      name: "Gắn kỹ năng nổi bật",
      description: "Hiển thị các kỹ năng quan trọng trên tin tuyển",
      allowLimit: true,
      packageType: recruitment,
    },
    {
      code: "FRESH_EVERY_WEEK",
      name: "Làm mới tin mỗi tuần",
      description: "Tự động làm mới bài đăng sau mỗi 7 ngày",
      allowLimit: false,
      packageType: recruitment,
    },
    {
      code: "TOP_SEARCH",
      name: "Ưu tiên Top Search",
      description: "Ưu tiên hiển thị tin trên top kết quả tìm kiếm",
      allowLimit: false,
      packageType: recruitment,
    },
  ];

  await featureRepo.save(features);
  console.log("Seeded Features");
};
