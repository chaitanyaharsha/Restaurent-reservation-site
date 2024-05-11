import React, { useEffect, useState } from "react";
import Toast from "../../../utils/toast";
import EmployeeAPI from "../../../api/EmployeeAPI";
import { handleUpload } from "../../../utils/HandleUpload";
import { useEmployeeStore} from "../../../store/useEmployeeStore";
import { useEmployee } from "../../../hooks/useEmployeeData";
import { useCategoryData } from "../../../hooks/useCategoryData";
import { useAuthStore } from "../../../store/useAuthStore";
import "./profileview.css";

const EmployeeProfile = () => {
  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);

  const { user } = useAuthStore();
  const { data: employee, refetch } = useEmployee(user && user._id);
  const { data: categories } = useCategoryData();
  const [showForm, setShowForm] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    employeeid: "",
    name: "",
    address: "",
    phone: "",
    email: "",
    image: "",
    password: "",
  });

  useEffect(() => {
    if (employee && employee.data && employee.data.employee) {
      setFormData({
        employeeid: employee.data.employee.employeeid || "",
        name: employee.data.employee.name || "",
        address: employee.data.employee.address || "",
        phone: employee.data.employee.phone || "",
        email: employee.data.employee.email || "",
       // rides: employee.data.employee.rides || "",
        //category: rider.data.rider.category || "",
        image: employee.data.employee.image || "",
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleUpload({
      file,
      setPercent,
      setImage: (url) => {
        setFormData((prevState) => ({
          ...prevState,
          image: url,
        }));
      },
    });
  };

  // Update mutation
  const onSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = { ...formData };
    if (!dataToSend.password) {
      delete dataToSend.password; // Remove password from data if it's empty
    }

    // Call API to update rider
    try {
      await EmployeeAPI.update({ data: dataToSend, id: user._id });
      // reset form
      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
        category: "",
        image: "",
        password: "",
      });
      refetch();
      Toast({ type: "success", message: "Employee updated successfully" });
      setShowForm(false);
    } catch (error) {
      Toast({ type: "error", message: error.message });
    }
  };

  return (
    <div className="profilecontainer">
      <div className="profilesection">
        <h1>👨 Profile : {employee && employee.data && employee.data.employee ? employee.data.employee.name : ""}</h1>
      </div><br /><br />
      <div className="formcontainer">
        <form onSubmit={onSubmit} style={{ width: '50%', marginLeft: '250px' }}>
          <label htmlFor="">Update Employee : {employee && employee.data && employee.data.employee ? employee.data.employee.name : ""}</label><br /><br />
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Address Input */}
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <textarea
              className="form-control"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Contact Input */}
          <div className="mb-3">
            <label htmlFor="contact" className="form-label">
              Contact
            </label>
            <input
              type="text"
              className="form-control"
              id="contact"
              name="contact"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              Current Image
            </label>
            <br />
            <img src={formData.image} alt={formData.name} width="50" height="50" />
          </div>

          {/* Image Upload */}
          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              New Image
            </label>
            <input
              type="file"
              className="form-control"
              id="image"
              name="image"
              onChange={handleFileChange}
            />
            <div className="progress mt-2">
              <div
                className={`progress-bar bg-success ${
                  percent < 100 ? "progress-bar-animated progress-bar-striped" : ""
                  }`}
                role="progressbar"
                style={{ width: `${percent}%` }}
                aria-valuenow={percent}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {percent < 100 ? `Uploading ${percent}%` : `Uploaded ${percent}%`}
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              // required
              autoComplete="new-password"
              minLength="6"
            />
          </div>

          {/* Category Select */}
          {/* <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              className="form-control"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories &&
                categories.data.categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>*/}

          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeProfile;
