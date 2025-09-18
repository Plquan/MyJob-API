import { FileType } from "@/common/enums/file-type/file-types";
import { MyJobFileDto } from "@/dtos/myjob-file/myjob-file-dto";
import { MyJobFile } from "@/entities/myjob-file";
import { UploadApiResponse } from "cloudinary";

export default class MyjobFileMapper {
    public static toMyJobFileFromCreate(request: UploadApiResponse, fileType: FileType): MyJobFile {
        let newFile = new MyJobFile();
        newFile.publicId = request.public_id;
        newFile.url = request.secure_url;
        newFile.fileType = fileType;
        newFile.resourceType = request.resource_type;
        newFile.format = request.format;
        return newFile;
    }
    public static toMyJobFileDto(entity: MyJobFile): MyJobFileDto {
        let dto = new MyJobFileDto();
        dto.id = entity.id;
        dto.publicId = entity.publicId;
        dto.url = entity.url;
        dto.fileType = entity.fileType;
        dto.resourceType = entity.resourceType;
        dto.format = entity.format;
        dto.createdAt = new Date(entity.createdAt);
        dto.updatedAt = new Date(entity.updatedAt);
        return dto;
    }


}