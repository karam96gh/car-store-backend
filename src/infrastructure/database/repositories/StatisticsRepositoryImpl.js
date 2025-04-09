/**
 * تنفيذ مستودع الإحصاءات
 * يستخدم Prisma للتفاعل مع قاعدة البيانات
 */
const prisma = require('../prismaClient');

class StatisticsRepositoryImpl {
  /**
   * زيادة عدد الزيارات
   * @param {Date} date - التاريخ
   * @returns {Promise<Object>} - الإحصائية المحدثة
   */
  async incrementVisits(date) {
    try {
      // البحث عن إحصائية لهذا اليوم
      const existingStat = await prisma.statistic.findUnique({
        where: { date }
      });

      if (existingStat) {
        // إذا كانت موجودة، قم بزيادة العداد
        return await prisma.statistic.update({
          where: { date },
          data: {
            totalVisits: {
              increment: 1
            }
          }
        });
      } else {
        // إذا لم تكن موجودة، قم بإنشاء سجل جديد
        return await prisma.statistic.create({
          data: {
            date,
            totalVisits: 1
          }
        });
      }
    } catch (error) {
      throw new Error(`فشل تسجيل الزيارة: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصاءات الزيارات
   * @returns {Promise<Object>} - إحصاءات الزيارات
   */
  async getVisitStats() {
    try {
      // تواريخ للفلترة
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // الأحد كبداية الأسبوع

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // إحصاءات اليوم
      const todayStats = await prisma.statistic.findUnique({
        where: { date: today }
      });

      // إحصاءات الأسبوع
      const weekStats = await prisma.statistic.aggregate({
        where: {
          date: {
            gte: startOfWeek,
            lte: today
          }
        },
        _sum: {
          totalVisits: true
        }
      });

      // إحصاءات الشهر
      const monthStats = await prisma.statistic.aggregate({
        where: {
          date: {
            gte: startOfMonth,
            lte: today
          }
        },
        _sum: {
          totalVisits: true
        }
      });

      // إجمالي الإحصاءات
      const totalStats = await prisma.statistic.aggregate({
        _sum: {
          totalVisits: true
        }
      });

      return {
        today: todayStats?.totalVisits || 0,
        thisWeek: weekStats._sum.totalVisits || 0,
        thisMonth: monthStats._sum.totalVisits || 0,
        total: totalStats._sum.totalVisits || 0
      };
    } catch (error) {
      throw new Error(`فشل الحصول على إحصاءات الزيارات: ${error.message}`);
    }
  }

  /**
   * الحصول على إحصاءات الزيارات اليومية
   * @param {number} days - عدد الأيام
   * @returns {Promise<Array>} - إحصاءات الزيارات اليومية
   */
  async getDailyVisits(days = 30) {
    try {
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);

      // الحصول على إحصاءات الزيارات خلال الفترة المحددة
      const stats = await prisma.statistic.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: {
          date: 'asc'
        }
      });

      // إعداد مصفوفة من التواريخ لملء الأيام المفقودة
      const result = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const formattedDate = currentDate.toISOString().split('T')[0];
        
        // البحث عن إحصائية لهذا اليوم
        const dayStat = stats.find(
          stat => stat.date.toISOString().split('T')[0] === formattedDate
        );

        result.push({
          date: formattedDate,
          visits: dayStat ? dayStat.totalVisits : 0
        });

        // الانتقال إلى اليوم التالي
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return result;
    } catch (error) {
      throw new Error(`فشل الحصول على إحصاءات الزيارات اليومية: ${error.message}`);
    }
  }
}

module.exports = StatisticsRepositoryImpl;