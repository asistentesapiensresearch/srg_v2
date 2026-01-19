import { Outlet } from "react-router-dom"
import Navigation from "@src/components/Navigation"

const Layout = ({

}) => {
    return (
        <>
            <Navigation/>
            <Outlet/>
        </>
    )
}

export default Layout;