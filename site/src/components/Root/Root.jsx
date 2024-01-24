import SecondaryNavbar from '../Navbar/SecondaryNavbar'
import CustomNavbar from '../Navbar/Navbar'
import { Outlet } from 'react-router'

function Root() {
    return (
        <>
            {/* Secondary Navbar */}
            <SecondaryNavbar />
            {/* Main Navbar */}
            <CustomNavbar />
            <Outlet />
        </>
    )
}

export default Root