import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { server } from "../../server";
import { useNavigate } from "react-router-dom";

export default function GoogleLoginComponent() {
  const navigate = useNavigate();
  const handleSuccess = async (credentialResponse) => {
    // If you are using the authorization code flow, you will receive a code to be exchanged for an access token
    const authorizationCode = credentialResponse.code;

    console.log(credentialResponse, "cred res");
    console.log(authorizationCode, "auth code");
    // Send the authorization code to your backend server
    try {
      await axios.post(
        `${server}/user/google-login`,
        {
          credential: credentialResponse.credential,
        },
        {
          withCredentials: true,
        }
      );
      navigate("/");
      window.location.reload(true);
    } catch (err) {
      console.log(err, "error");
    }
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      useOneTap
      auto_select={true}
      // flow="auth-code"

      // size="large"
      // theme="filled_blue"
      // text="continue_with"
    />
  );
}
