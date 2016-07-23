<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="wbERPGBL._default" %>
<!DOCTYPE html>
<head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <meta name="format-detection" content="telephone=no">
        <meta charset="UTF-8">

        <meta name="description" content="ERP perteneciente a la empresa GLOBAL BUSINESS LATAM S.A.C.">
        <meta name="author" content="grodriguez@plenagroup.com.pe">
        <meta name="keywords" content="ERP, GLOBAL, BUSINESS, LATAM">
        <title>ERP :: GLOBAL BUSINESS LATAM </title>
        <!-- CSS -->
        <link href="css/bootstrap.min.css" rel="stylesheet">
        <link href="css/form.css" rel="stylesheet">
        <link href="css/style.css" rel="stylesheet">
        <link href="css/animate.css" rel="stylesheet">
        <link href="css/generics.css" rel="stylesheet"> 
        <link href="css/icons.css" rel="stylesheet">
        <script src="js/jquery.min.js"></script>
        <script src="js/bootstrap.min.js"></script>
        <script src="js/icheck.js"></script>
        <script src="js/functions.js"></script>
        <script src="js/Controllers/jsUtil.js"></script>
        <script src="js/Controllers/jsLogin.js"></script>
    </head>
    <body id="skin-tectile">
        <section id="login">
            <header>
                <h1>ERP :: GLOBAL BUSINESS LATAM</h1>
                <p>LOGIN</p>
            </header>
        
            <div class="clearfix"></div>
            
            <!-- Login -->
            <form class="box tile animated active" id="box-login" action="#" autocomplete="off">
                <h2 class="m-t-0 m-b-15">Login</h2>
                <input type="text" class="login-control m-b-10" placeholder="USUARIO" value="grodriguez" required="required" id="txtUsuario" autocomplete="off">
                <input type="password" class="login-control" placeholder="CONTRASEÑA" value="123456" required="required" id="txtContrasena">
                <h4 id="txtLoading" class="tile-light"></h4>
                <button class="btn btn-sm m-r-5" id="btnLog" type="submit">ENTRAR</button>
                <div class="alert alert-danger alert-icon" id="dvResultado" style="display:none;">
                </div>
            </form>
            
            <!-- Register -->
            <form class="box animated tile" id="box-register">
                <h2 class="m-t-0 m-b-15">Register</h2>
                <input type="text" class="login-control m-b-10" placeholder="Full Name">
                <input type="text" class="login-control m-b-10" placeholder="Username">
                <input type="email" class="login-control m-b-10" placeholder="Email Address">    
                <input type="password" class="login-control m-b-10" placeholder="Password">
                <input type="password" class="login-control m-b-20" placeholder="Confirm Password">

                <button class="btn btn-sm m-r-5">Register</button>

                <small><a class="box-switcher" data-switch="box-login" href="#">Already have an Account?</a></small>
            </form>
            
            <!-- Forgot Password -->
            <form class="box animated tile" id="box-reset">
                <h2 class="m-t-0 m-b-15">Reset Password</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eu risus. Curabitur commodo lorem fringilla enim feugiat commodo sed ac lacus.</p>
                <input type="email" class="login-control m-b-20" placeholder="Email Address">    

                <button class="btn btn-sm m-r-5">Reset Password</button>

                <small><a class="box-switcher" data-switch="box-login" href="#">Already have an Account?</a></small>
            </form>
        </section>
    </body>
<!-- Mirrored from byrushan.com/projects/sa/1-0-3/login.html by HTTrack Website Copier/3.x [XR&CO'2014], Mon, 07 Mar 2016 17:35:20 GMT -->
</html>
