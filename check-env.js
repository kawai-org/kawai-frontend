console.log("-----------------------------------------");
console.log("🔍 ENV CHECKER (Running with Bun)");
console.log("-----------------------------------------");
console.log("Checking if .env.local is readable...");
console.log("");
console.log("VITE_BOT_NUMBER =", process.env.VITE_BOT_NUMBER);
console.log("VITE_API_URL    =", process.env.VITE_API_URL);
console.log("");

if (process.env.VITE_BOT_NUMBER) {
    console.log("✅ SUKSES! Bun bisa membaca .env.local");
    console.log("👉 Jika di browser masih error, berarti anda belum RESTART 'bun dev'");
    console.log("👉 Stop server (Ctrl+C), lalu jalankan 'bun dev' lagi.");
} else {
    console.log("❌ ERROR! Variable tidak terbaca.");
    console.log("👉 Cek nama file: harus '.env.local' (bukan env.local.txt)");
    console.log("👉 Cek isi file: pastikan 'VITE_BOT_NUMBER=62...'(tanpa spasi)");
}
console.log("-----------------------------------------");
