import cron from 'node-cron'
import { Not, IsNull } from 'typeorm'
import DatabaseService from './DatabaseService'
import CloudinaryService from './CloudinaryService'
import pLimit from 'p-limit'


export class BackgroundService {
  private readonly _context: DatabaseService
  constructor(DatabaseService: DatabaseService) {
       this._context = DatabaseService
  }

  start() {
    cron.schedule('0 * * * *', async () => {
      console.log(`[CRON] 🔄 Bắt đầu dọn file đã soft delete...`)

      const repo = this._context.MyJobFileRepo

      const files = await repo.find({
        where: { deletedAt: Not(IsNull()) },
        take: 10,
        withDeleted: true,
      })

        const limit = pLimit(5)

        await Promise.allSettled(
        files.map((file) =>
            limit(async () => {
            try {
                await CloudinaryService.deleteFile(file.publicId,file.resourceType)
                await repo.delete(file.id)
                console.log(`✅ Đã xóa ảnh ${file.publicId}`)
            } catch (err) {
                console.error(`❌ Lỗi khi xóa ${file.publicId}:`, err.message)
            }
            })
        )
        )

      console.log(`[CRON] ✅ Kết thúc batch dọn file`)
    })
  }
}
