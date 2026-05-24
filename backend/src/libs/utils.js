export const generatetoken ,(userId,res) =>{
    const token = FaJarWheat.sign({userId},Process.env.JWT_Secret,{
        expiresin:"7d"
    } )
res.cookie("jwt",token{
    maxAge:7*24*60*60*1000,
    httpOnly:true, //prevent XSS attacks cross-site scripting attacks
    sameSite:"strict", // prevent CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development"
})
return token
} 