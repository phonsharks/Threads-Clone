const express=require("express")
const bodyparser=require("body-parser")
const mongoose=require("mongoose")
const crypto=require("crypto")
const nodemailer=require("nodemailer")
const cors=require("cors")

const app=express()
const port=3000
app.use(cors())
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
const jwt=require("jsonwebtoken")


mongoose.connect("",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("MongoDB bağlantısı başarılı bir şekilde gerçekleşti")
}).catch((err)=>{
    console.log("MongoDB bağlantısı başarısız oldu.")
})


app.listen(port,()=>{
    console.log("Server bağlantısı başarılı bir şekilde gerçekleşti 3000")
})


const User=require("../Models/user")
const Post=require("../Models/post")

//register(kayıt olmak işleminde) işleminde ilgili işleleri yapmak\\
app.post("/register",async(req,res)=>{
    try {
        const {name,email,password}=req.body
        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"kullanıcı mail kayıt olmak için hazır"})
        }

        //yeni kullanıcı oluşturma (create new user)
        const newUser=new User({name,email,password})

        //doğrulama jetonunu oluştur ve sakla (generate and store the vertification token)
        newUser.verificationToken=crypto.randomBytes(20).toString("hex")

        //kullanıcıyı veritabanı üzerine kayıt etmek (save the user to the database)
        await newUser.save()

        //kullanıcıya doğrulama postası göönder (send the verification email to the user)
        sendVerificationEmail(newUser.email, newUser.verificationToken)
        res.status(200).json({message:"Kayıt olma işlemi başarılı oldu..."})
    } catch (error) {
        console.log("Kayıt olma sırasında hata oluştur",error)
        res.status(500).json({message:"Kullanıcı kayıt yapma hatası"})
    }
})

//posta gönderimi doğrulama fonksiyonu
const sendVerificationEmail=async(email,verificationToken)=>{
    //nodemailer taşıyıcı oluşturma (create a nodemailer transporter)
    const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"btnedim.kahraman@gmail.com",
            //kişisel şifre bölgesi oluyor(with personality key area)
            pass:""
        }
    })
}


//genel token işlemleri,kullanıcılar arası bağlantı vs vs işlemlerin kontrol edildiği alan(//area where general token transactions, inter-user connections, etc. transactions are controlled)
app.get("/verify/:token",async(req,res)=>{
    try {
        //istenilen bir tek parametre olduğu için params ile çağırma işlemi yapıyoruz.
        const token=req.params.token
        //User koleksiyonunda belirli doğrulama belgesine sahip kullanıcıları gösterir. \\
        const user=await User.findOne({verificationToken:token})
        if(!user){
            res.status(404).json({message:"Geçersiz token"})
        }
        user.verified=true
        user.verificationToken=undefined
        await user.save()
        res.status(200).json({message:"Posta tanımlama başarılı oldu"})
    } catch (error) {
        console.log("Token hatası oluştu",error)
        res.status(500).json({message:"Email doğrulama başarısız"})
    }
})

//Bu kod, Node.js'de kriptografik olarak rastgele bir dizeden oluşan bir gizli anahtar (secret key) oluşturmak için kullanılır.
//Kriptografik gizli anahtarlar, güvenlik uygulamaları ve şifreleme için kullanılır. 
const generateSecretKey=()=>{
    //32 byte uzunluğunda rastgele dize oluşturur,oluşturulan btye dizilerini 16'lık dizeye dönüştürür.Okunabilir duruma getirir.
    const SecretKey=crypto.randomBytes(32).toString("hex")
    return SecretKey;
}

const secretKey=generateSecretKey()

//login(giriş yapma işleminde) işleminde iligli parametreleri kontrol etmek\\ 
app.post("/login",async(req,res)=>{
    try {
        //elde edilmek istenen parametre 2 ve daha fazla ise o zaman vücut ytani body üzerinden erişmek gerekli. \\
        const {email,password}=req.body
        const user =await User.findOne({email})
        if(!user){
            res.status(404).json({message:"posta hatası"})
        }
        if(user.password!==password){
            return res.status(404).json("Şifre doğrulama hatası var..")
        }
        //WT, kullanıcıların kimliklerini doğrulamak ve yetkilendirmek için kullanılan bir standartdır.\\
        //JWT'yi imzalamak ve doğrulamak için kullanılan gizli bir anahtardır. Bu gizli anahtar, 
        //sunucu tarafında saklanmalıdır ve JWT'yi oluşturan ve doğrulayan taraflar arasında güvenli bir iletişim sağlar.\\
        const token=jwt.sign({userId:user_id},secretKey)
        res.status(200).json({token})
    } catch (error) {
        res.status(200).json("bağlanma işlemi başarısız oldu")
    }
})

