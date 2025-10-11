import React from "react";
import { logoutUser } from "../api";
import { toast } from "react-toastify";

const Logout = () => {
  const handleDelete = async () => {
    try {
      await logoutUser();
      toast.success("Logout successful");
      setTimeout(() => {
        document.location.href = "/";
      }, 1100);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
    
    // Close the modal by unchecking the checkbox
    const modalCheckbox = document.getElementById("logout_modal");
    if (modalCheckbox) {
      modalCheckbox.checked = false;
    }
  };

  return (
    <>
      <label htmlFor={"logout_modal"} className="btn btn-error">
        Logout
      </label>
      <input
        type="checkbox"
        id={"logout_modal"}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box text-base-content">
          <div className="flex gap-2 flex-col items-center justify-center">
            <p className="text-lg capitalize font-bold text-center">
              Are you sure you want to logout?
            </p>
            <p className="text-lg text-center">do you really want to logout and miss out on our products?</p>
            <div className="flex gap-2 items-center justify-center">
              <label
                htmlFor={"logout_modal"}
                className="btn btn-neutral"
              >
                Close
              </label>
              <button onClick={handleDelete} className="btn btn-error">
                Log Out
              </button>
            </div>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor={"logout_modal"}>
          Close
        </label>
      </div>
    </>
  );
};

export default Logout;
