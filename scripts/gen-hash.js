const bcrypt = require('bcryptjs');
const fs = require('fs');

async function main() {
  const hash = await bcrypt.hash('admin123', 12);
  console.log('Hash:', hash);
  
  // Delete old DB
  if (fs.existsSync('prisma/dev.db')) {
    fs.unlinkSync('prisma/dev.db');
    console.log('Deleted old dev.db');
  }
  
  console.log('Now run: npx prisma db push && npx tsx prisma/seed.ts');
  console.log('Then update seed.ts hash to:', hash);
}

main();
