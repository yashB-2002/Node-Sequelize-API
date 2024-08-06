const User  = require('./models/user');
const { validateUser, validateEmail, validatePassword } = require('./utils/validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
 
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

let refreshTokens = [];
exports.register = async (req,res) => {
    try {
        
        const {firstname,lastname, email,password,hobbies,gender,age,phonenumber,isActive,address} = req.body

        const { isValid, errors } = validateUser(req.body);
        // console.log(errors,isValid);
    
        // if(!validateUser(req.body)){
            //     return res.status(400).json({
            //         success:false,
            //         error:"Password or email mismatch with the format."
            //     })
            // }
            
        
        //! check for all the fields validation
        if (!isValid) {
            return res.status(400).json({
            success: false,
            error: 'Validation error',
            details: errors,  
            });
        }

        //! check if user already exist
        // const user = User.findOne({
        //     where:{
        //         email:email
        //     }
        // })

        // if(user) {
        //     return res.status(409).json({
        //         success:false,
        //         error:"User with same email already exists."
        //     })
        // }


        //! hashing of pwd and saving in db
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({firstname,lastname, email,password:hashedPassword,hobbies,gender,age,phonenumber,isActive,address})

        return res.status(201).json({ message: 'User created successfully', user: newUser })

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: `User can not be registered. ${error.message}`
        });
    }
}


//! login route
// exports.login = async (req,res) => {

//     const {email,password} = req.body;

    // if(!validateEmail(email) || validatePassword(password)){
    //     return res.status(400).json({
    //         success:false,
    //         error:"Password or email mismatch with the format."
    //     })
    // }
    

//     const user = await User.findOne({
//         where:{
//             email:email
//         }
//     })

//     console.log(user+"current user.");
    
//     if(!user) {
//         return res.status(401).json({
//             success: false,
//             error: "Unauthorized User found."
//         });
//     }

//     const isPwdMatch = await bcrypt.compare(password, user.password);

//     if(!isPwdMatch) {
//         return res.status(404).json({
//             success: false,
//             error: "Password is invalid."
//         });
//     }


//     const accessToken = jwt.sign({ userId: user.id }, accessTokenSecret, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    
//     const refreshToken = jwt.sign({ userId: user.id }, refreshTokenSecret, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
 
//     refreshTokens.push(refreshToken);
 
//     return res.status(200).json({
//         success: true,
//         message: 'Log in successfull.',
//         data: {
//             user:user,
//         }
//     })

// }

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const {userAgent} = req.headers['user-agent']

    const user = await User.findOne({
        where: {
            email: email
        }
    });

    console.log(user + " current user.");

    if (!user) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized User found."
        });
    }

    const isPwdMatch = await bcrypt.compare(password, user.password);

    if (!isPwdMatch) {
        return res.status(404).json({
            success: false,
            error: "Password is invalid."
        });
    }

    const accessToken = jwt.sign({ userId: user.id }, accessTokenSecret, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ userId: user.id, userAgent }, refreshTokenSecret, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });

    refreshTokens.push({token:refreshToken});

    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.setHeader('x-refresh-token', refreshToken);

    return res.status(200).json({
        success: true,
        message: 'Log in successful.',
        data: {
            user: user,
        }
    });
};



exports.refreshToken = async (req,res) => {

    const {refreshToken} = req.body

    const {userAgent} = req.headers['user-agent']

    if(!refreshToken) {
        return res.status(400).json({
            message:"No refresh token found in payload."
        })
    }


    const storedToken = refreshTokens.find(token => token.token === refreshToken);
 
    if (!storedToken) {
        return res.status(400).json({ message: 'Invalid refresh token.' });
    }


    try {

        const payload = jwt.verify(refreshToken, refreshTokenSecret);
 
        if (storedToken.userAgent !== userAgent) {
            return res.status(403).json({ message: 'Device fingerprint mismatch.' });
        }
 
        const newAccessToken = jwt.sign({ userId: payload.userId }, accessTokenSecret, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
 
        const newRefreshToken = jwt.sign({ userId: payload.userId, userAgent }, refreshTokenSecret, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
 
        refreshTokens = refreshTokens.filter(token => token.token !== refreshToken); 

        refreshTokens.push({token:newRefreshToken}); 
 
        res.setHeader('Authorization', `Bearer ${newAccessToken}`);
        res.setHeader('x-refresh-token', newRefreshToken);

        return res.status(200).json({success:true, message:"Token regenerated successfull."});

    } catch (error) {

        return res.status(400).json({ message: 'Invalid refresh token.' });

    }


}

exports.logout = (req,res) => {

    const {refreshToken} = req.body;


    if(!refreshToken) {
        return res.status(400).json({
            message:"No refresh token found in payload."
        })
    }

    refreshTokens = refreshTokens.filter(token => token.token !== refreshToken); 

    return res.status(200).json({
        message:'logout successfull.'
    })
}

