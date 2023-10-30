const mongoose = require("mongoose");

/*

1->Burada oluşturulan model aşağıda verilen özellikleri tutmaktadır.Bu modeller yardımıyla birlikte  veri tabanı
kayıt altındayken yer alacak olan verilerdir.
2->Burada oluşturulan tanımlamalar kişisel olmakla birlikte projenin veri tabanında tutulacak olan verilerin kayıt ve genel
anlamda tanım durumu olmaktadır.

*/
const userSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  joinDate: { type: Date, default: Date.now },
  //her bir takip isteği User modelini referans verir\\
  sentFollowRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  receivedFollowRequests: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
