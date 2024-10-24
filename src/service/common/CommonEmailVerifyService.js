const SendEmailUtility = require("../../utility/SendEmailUtility");
const CommonEmailVerifyService = async (Request, DataModel, OTPModel) => {
    try{
        let UserEmail = Request.params.email
        let UserCount = await DataModel.aggregate([
            {$match: {email: UserEmail}}
        ])
        if(UserCount.length>0){ 

            let OTP =  Math.floor(Math.random() * (90000-10000 +1)) + 10000;
            let SentOTP = await OTPModel.create({UserEmail:UserEmail, UserOTP:OTP})

            let mailSub = 'Email verification code'
            let mailHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email OTP Verification</title>

    <style>
        *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'poppins', sans-serif;
        }
        :root{
            --background: #f1f7f2;
            --overLay: #443301a3;
        }
        body{
            width: 100%;
            height: 100vh;
            background: #f1f7f2;
            overflow-x: hidden;
        }

        .Banner{
            width: 80%;
            height: 200px;
            background: url('https://wallpaperaccess.com/full/4230797.jpg') no-repeat center center;
            background-size: cover;
            margin: 0 auto;
            border-bottom-left-radius: 15px;
            border-bottom-right-radius: 15px;
            position: relative !important;
            z-index: 1;
        }
        .msg7927844277334765400 .m_7927844277334765400OTP{
            position: relative;
        }
        .Banner::after{
            content: '' !important;
            position: absolute !important;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #443301a3;
            border-bottom-left-radius: 15px;
            border-bottom-right-radius: 15px;
            z-index: -1;
        }

        .Banner h1{
            font-size: 30px;
            font-weight: 600;
            text-transform: uppercase;
            color: #f1f7f2;
            display: block;
        }
        .Banner span{
            font-size: 30px;
            font-weight: 500;
            color: #f1f7f2;
            letter-spacing: 1px;
            display: block;
        }

        .content-block h3{
            font-size: 25px;
            color: #111010;
            font-weight: 600;
            line-height:25px;
            margin-bottom: 35px;
        }
        .content-block p{
            font-size: 18px;
            width: 80%;
            font-weight: 500;
            color: #606060;
            line-height:25px;
            text-align: center;
        }
        .OTP{
            margin: 50px 0;
            padding: 10px 15px;
            line-height: 40px;
            font-size: 35px;
            letter-spacing: 15px;
            border: 1px solid #e7e7e7;
            text-align: center;
            color: #33212a;
            position: relative;
        }
        .coppied-on{
            visibility: visible;
            opacity: 1;
        }


        @media(max-width: 900px){
            .Banner{
                width: 100%;
                padding: 80px 30px !important;
            }
            .content-block{
                width: 90%;
            }
            .Banner h1{
                font-size: 16px;
                line-height: 30px;
            }
            .OTP{
                margin: 20px 0;
                font-size: 30px;
            }
            .content-block h3{
                margin-bottom: 5px;

            }
            .content-block p{
                font-size: 16px;
                width: 90%;
            }
        }

        @media(max-width: 600px){
            .Banner{
                width: 100%;
                padding: 80px 20px !important;
            }
            .content-block{
                width: 90%;
                height: 45%;
                background: #f1f7f2;
                margin: 0 auto;
                position: absolute;
                top: 20%;
                left: 50%;
                transform: translateX(-50%);
                z-index: 111;
                border-radius: 15px;
                box-shadow: 15px 15px 35px rgba(0, 0, 0, 0.1);
            }
            .Banner h1{
                font-size: 16px;
                line-height: 30px;
            }
            .OTP{
                margin: 20px 0;
                font-size: 30px;
            }
            .content-block h3{
                margin-bottom: 5px;

            }
            .content-block p{
                font-size: 16px;
                width: 90%;
            }
        }

    </style>


</head>
<body>
    <section class="container" style="width: 100%;
    height: 100vh;
    position: relative;">
        <div class="Banner" style="padding: 40px 70px;">
            <div>
                <h1 style="display: block; width: 100%; text-align: center;">Rabiul Islam Rocky</h1>
                <span style="display: block; width: 100%; text-align: center;">Web Developer</span>
            </div>
        </div>
        <div class="content-block" style="
            width: 90%;
            height: 300px;
            background: #f1f7f2;
            margin: 0 auto;
            position: absolute;
            top: 25%;
            left: 50%;
            transform: translateX(-50%);
            z-index: 111;
            border-radius: 15px;
            box-shadow: 15px 15px 35px rgba(0, 0, 0, 0.1)
        ">
            <h3 style="width: 100%; text-align: center; margin: 20px 0px; padding-top: 15px">Your OTP</h3>
            <p style="width: 90%; text-align: center; margin: 20px 0px; margin: 20px auto;">Thank you for choosing me as your expert developer. Use the following OTP to complete the procedure to verification your email that you are a valid user.  OTP is valid for 15 Minutes. Do not share this code with others</p>

            <div style="margin: 50px auto">
            <sup class="note" style="
            display: block;
            width: 100%;
            text-align: center;
            font-size: 10px;
            text-transform: uppercase;
            color: #606060;
            margin-bottom: 5px;
            ">Copy OTP & complete verification</sup>
            <h1 class="OTP" style="position: relative; width: fit-content; margin: 0px auto;"><span class="code">${OTP}</span>

                <span class="coppied" style="
                position: absolute;
                content: '';
                bottom: -25px;
                left: 50%;
                transform: translateX(-50%);
                letter-spacing: 0.5px;
                font-size: 13px;
                background: rgba(5, 206, 55, 0.24);
                line-height: 15px;
                padding: 2px 3px;
                border-radius: 5px;
                color: #33212a;
                display: none;
                transition: all.3s;"
                >coppied</span>
            </h1>
            </div>
            
        </div>
    </section>


    <script>
        let code = document.querySelector('.code')
        let coppied = document.querySelector('.coppied')
        code.addEventListener('click', () => {
            let value = code.innerText;
            navigator.clipboard.writeText(value);
            coppied.style.display  = 'block'

            setTimeout(() => {
                coppied.style.display  = 'none'
            }, 3000)
        })

    </script>

</body>
                            </html>`

            let data = await SendEmailUtility(UserEmail, mailSub, mailHTML)
            return {status: 'success', message: 'We\'ve been sent you 5 digit code, check your email', data: data}
        }else{
            return {status: 'Unauthorized', message: 'Its seems to be you aren\'t authorize user', data: null}
        }
    }catch(err){
        return {status: 'failed', data: err.toString()}
    }
}
module.exports = CommonEmailVerifyService;