## Catatan Kecil

- `req.user.id` di product-route itu adalah id user dari `req.user = validToken.user` di authTokenAndPermission.js.
- `productId` di product-route adalah hasil `const { productId } = req` yg di peroleh dari validateProductId.js.


## Belum terselesaikan
1. permission di payment-route masih add_order belum add_payment?
2. bagaimana jika user bayar lagi order yg sudah terbayar.
3. di payment route di body inputannya `order_id`, bagaiman kalau `order_id` salah atau tidak ada.
4. Ketika check out atau order, seleksi cart nya masih menggunakan `user_id`. Artinya semua product di cart di check out, karena belum diselect berdasarkan `cart_id` nya.
