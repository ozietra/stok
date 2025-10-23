// reset-admin.js
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

// SQLite veritabanı dosyanızın yolu
const dbPath = path.join(__dirname, 'database.db'); // veya 'stok.db', 'data.db' vb.

async function resetAdmin() {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('❌ Veritabanına bağlanılamadı:', err);
      process.exit(1);
    }
    console.log('📦 SQLite veritabanına bağlanıldı');
  });

  try {
    const email = 'admin@stok.com';
    const newPassword = 'admin123';
    
    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Admin kullanıcısını güncelle
    db.run(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email],
      function(err) {
        if (err) {
          console.error('❌ Güncelleme hatası:', err);
        } else if (this.changes > 0) {
          console.log(`✅ ${email} şifresi başarıyla sıfırlandı!`);
        } else {
          console.log(`❌ ${email} kullanıcısı bulunamadı!`);
          console.log('💡 Önce kullanıcıları kontrol edin: SELECT * FROM users;');
        }
        
        db.close();
        process.exit(0);
      }
    );
  } catch (error) {
    console.error('❌ Hata:', error);
    db.close();
    process.exit(1);
  }
}

resetAdmin();
