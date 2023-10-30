const mongoose = require("mongoose");

/*

1->Burada oluşturulan model aşağıda verilen özellikleri tutmaktadır.Bu modeller yardımıyla birlikte  veri tabanı
kayıt altındayken yer alacak olan verilerdir.
2->Burada oluşturulan tanımlamalar kişisel olmakla birlikte projenin veri tabanında tutulacak olan verilerin kayıt ve genel
anlamda tanım durumu olmaktadır.

*/

const postSchema = new mongoose.Schema({
  content: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  replies: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      content: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
