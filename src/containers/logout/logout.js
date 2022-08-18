import {useEffect} from "react";
import Cookies from "universal-cookie";
import {useHistory} from "react-router-dom";

const Logout = () => {
    const cookies = new Cookies();
    const history = useHistory();
    useEffect(() => {
        cookies.remove("balloonUserToken",{ path: '/' });
        cookies.remove("response",{ path: '/' });
        cookies.remove("userId",{ path: '/' });
        cookies.remove("username",{ path: '/' });
        cookies.remove("firstname",{ path: '/' });
        cookies.remove("lastname",{ path: '/' });
        cookies.remove("email",{ path: '/' });
        cookies.remove("token",{ path: '/' });
        cookies.remove("userRole",{ path: '/' });
        cookies.remove("profilePicture",{ path: '/' });
        sessionStorage.clear();
        history.push("/userlogin");
    });

    return (
        <>
        </>
    );
}

export default Logout;
