import { useState } from "react"

import RemovalPopup from "../../ReusableComponents/Reusable"
import ComponentFooter from "../../ReusableComponents/ComponentFooter";
import { useData } from "../../GlobalData/ApplicationData";

export default function ViewStaff() {

    const { staff, setStaff } = useData()

    const staffToDisplay = staff.filter(s => s.type !== 'admin');

    // ***Backend Route (Fetch Flights) 
    const [deletionPopup, setDeletionPopup] = useState(false);
    const [staffToDelete, setStaffToDelete] = useState("");

    const removeStaff = (username) => {
        setStaff(prev => prev.filter(staff => staff.username !== username))
    }

    return (
        <>
            <div className="w-full h-full">{staff.length < 1 ? (

                <div className="w-full h-full flex justify-center items-center bg-orange-50">
                    <p className="text-6xl text-emerald-950">No staff present</p>
                </div>
            ) : (
                <div className="w-full h-full bg-orange-50 flex justify-center items-center">

                    <ComponentFooter title={'Staff'} />

                    {deletionPopup &&
                        <RemovalPopup
                            toRemove={staffToDelete}
                            confirm={() => {
                                removeStaff(staffToDelete.username);
                                setDeletionPopup(false);
                                setStaffToDelete("");
                            }}
                            cancel={() => {
                                setDeletionPopup(false);
                                setStaffToDelete("")
                            }}
                            message={`Are you sure you want to remove staff member ${staffToDelete.firstName} ${staffToDelete.lastName}?`} />

                    }



                    <div className="w-9/12 max-h-[60vh] overflow-y-auto">
                        <table className="w-full table-fixed border-collapse text-emerald-950">
                            <thead>
                                <tr>
                                    <th className="p-4">Staff Type</th>
                                    <th className="p-4">First Name</th>
                                    <th className="p-4">Last Name</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Phone</th>
                                    <th className="p-4">Username</th>
                                    <th className="p-4">Airline</th>
                                    <th className="p-4">Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staffToDisplay.map((staff) => (
                                    <tr key={staff.username} className="text-center border-b">
                                        <td className="p-4">{staff.type}</td>
                                        <td className="p-4">{staff.firstName}</td>
                                        <td className="p-4">{staff.lastName}</td>
                                        <td className="p-4">{staff.emailAddress}</td>
                                        <td className="p-4">{staff.phoneNumber}</td>
                                        <td className="p-4">{staff.username}</td>
                                        <td className="p-4">{staff.airline}</td>
                                        <td className="p-4">
                                            <button className="cursor-pointer" onClick={() => { setStaffToDelete(staff); setDeletionPopup(true) }}>
                                                <svg className="fill-red-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path d="M256,136a8,8,0,0,1-8,8H200a8,8,0,0,1,0-16h48A8,8,0,0,1,256,136Zm-57.87,58.85a8,8,0,0,1-12.26,10.3C165.75,181.19,138.09,168,108,168s-57.75,13.19-77.87,37.15a8,8,0,0,1-12.25-10.3c14.94-17.78,33.52-30.41,54.17-37.17a68,68,0,1,1,71.9,0C164.6,164.44,183.18,177.07,198.13,194.85ZM108,152a52,52,0,1,0-52-52A52.06,52.06,0,0,0,108,152Z"></path></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}


                            </tbody>
                        </table>
                    </div>

                </div>
            )}</div>
        </>


    )
}