## Catatan Kecil

- `req.user.id` di product-route itu adalah id user dari `req.user = validToken.user` di authTokenAndPermission.js.
- `productId` di product-route adalah hasil `const { productId } = req` yg di peroleh dari validateProductId.js.


## Belum terselesaikan
1. permission di payment-route masih add_order belum add_payment?
2. bagaimana jika user bayar lagi order yg sudah terbayar.
3. di payment route di body inputannya `order_id`, bagaiman kalau `order_id` salah atau tidak ada.
4. Ketika check out atau order, seleksi cart nya masih menggunakan `user_id`. Artinya semua product di cart di check out, karena belum diselect berdasarkan `cart_id` nya. ✅
5. Product habis atau memasukkan jumlah product ke cart melebihi inventory. ✅
6. FILTER
7. Di check out, tentukan alamat kirim, jasa kirim, dan biaya lainnya. 
8. Cara agar halaman bisa terus menunggu pembayaran sampai sukses atau tidak. 
9. Edit profil⇒ nama, pasword, foto profil. 
10. Size product, warna product. 
11. Menampilkan product sesuai seller_id
12. add to cart jika quantitynya negatif = mengurangi product di cart. Jika product di kurngi menjadi kurang atau sama dengan nol => product di cart di hapus. ✅
13. page untuk product
