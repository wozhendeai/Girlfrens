import CustomNavbar from '../Navbar/Navbar'
import { Outlet } from 'react-router'

function Root() {
    return (
        <>
            {/* Main Navbar */}
            <CustomNavbar />
            <Outlet />
        </>
    )
}

export default Root