import { Authenticator, Image, useTheme, View } from "@aws-amplify/ui-react"
import logo from "../assets/images/logo-black.png"
import { Outlet, Link } from "react-router-dom";

const Auth = ({
    components = {
        Header() {
            const { tokens } = useTheme();

            return (
                <View textAlign="center" padding={tokens.space.large}>
                    <Link to="/">
                        <Image
                            alt="Amplify logo"
                            src={logo}
                            width={150}
                        />
                    </Link>
                </View>
            );
        }
    },
    children
}) => {
    return (
        <Authenticator components={components}>
            <Outlet />
        </Authenticator>
    )
}

export default Auth;