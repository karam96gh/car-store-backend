/**
 * إنشاء اتصال قاعدة البيانات باستخدام Prisma
 */
const { PrismaClient } = require('@prisma/client');

// إنشاء نسخة من Prisma Client
const prisma = new PrismaClient();

// سجل استعلامات قاعدة البيانات في وضع التطوير
if (process.env.NODE_ENV === 'development') {
  prisma.$use(async (params, next) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();
    
    console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
    
    return result;
  });
}

module.exports = prisma;