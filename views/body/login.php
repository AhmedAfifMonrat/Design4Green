<div id="login-modal">
    <div id="login-form" class="login-form">
        <div id="close_login" class="close-login-form">X</div>
        Sign In
        <form class="login-form">
            <input id="username" type="text" placeholder="Username"/>
            <input id="password" type="password" placeholder="Password"/>
            <button id="loginBtn" type="button" onclick="login();">Sign In</button>
            <p class="login-message">Not registered? <a href="#" onclick="showSignUpModal();">Create an account</a></p>
        </form>
    </div>
    <div id="signup-form" class="login-form">
        <div id="close_login" class="close-login-form">X</div>
        Sign Up
        <input id="signUpfirstName" type="text" placeholder="Name"/>
        <input id="signUpUsername" type="text" placeholder="Username"/>
        <input id="signUpPassword" type="password" placeholder="Password"/>
        <button id="signUpBtn" onclick="signUp();">Sign Up</button>
        <p class="login-message">Already registered? <a href="#" onclick="hideSignUpModal();">Sign In</a></p>
    </div>
</div>