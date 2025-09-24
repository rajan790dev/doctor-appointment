import React, { useContext, useState } from 'react';
import { User } from 'lucide-react';
import { AdminContext } from '../../context/AdminContext';
import {toast} from 'react-toastify'
import axios from 'axios'
const AddDoctor = () => {
  const [selectedImage, setSelectedImage] = useState(null);  // File object for backend
const [previewImage, setPreviewImage] = useState(null); 

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('');
  const [fees, setFees] = useState('');
  const [speciality, setSpeciality] = useState('General physician');
  const [education, setEducation] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [about, setAbout] = useState('');

  const {aToken,backendUrl} = useContext(AdminContext);


const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setSelectedImage(file);                     // store file for backend
    setPreviewImage(URL.createObjectURL(file)); // store blob url for preview
  }
};
 const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("experience", experience);
  formData.append("fees", fees);
  formData.append("speciality", speciality);
  formData.append("degree", education);
  formData.append("address", JSON.stringify({ line1: address1, line2: address2 }));
  formData.append("about", about);

  if (selectedImage) {
    formData.append("image", selectedImage); // 👈 name must match multer field
  }

  try {
    if (!selectedImage) {
      return toast.error("Image Not Selected");
    } else {
      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        {
          headers: { aToken, "Content-Type": "multipart/form-data" },
        }
      );

      if (data.success) {
        toast.success(data.message);

        // ✅ clear all fields after success
        setName("");
        setEmail("");
        setPassword("");
        setExperience("");
        setFees("");
        setSpeciality("General physician");
        setEducation("");
        setAddress1("");
        setAddress2("");
        setAbout("");
        setSelectedImage(null);
      } else {
        toast.error(data.message);
      }
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};


  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-gray-200 p-8"
      >
        {/* Image Upload Section */}
        <div className="flex items-center gap-4 mb-8">
          <label htmlFor="doc-img" className="cursor-pointer">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Doctor"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
            </div>
          </label>
          <input
            type="file"
            id="doc-img"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="text-gray-500">
            <p className="text-sm">Upload doctor</p>
            <p className="text-sm">picture</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor name
              </label>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor Email
              </label>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-1 focus:ring-blue-500 
                           focus:border-blue-500 bg-white"
              >
                <option value="">Experience</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={`${i + 1} Year`}>
                    {i + 1} Year
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fees
              </label>
              <input
                type="number"
                placeholder="Your fees"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speciality
              </label>
              <select
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-1 focus:ring-blue-500 
                           focus:border-blue-500 bg-white"
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education
              </label>
              <input
                type="text"
                placeholder="Education"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Address 1"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Address 2"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Full Width About Section */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About me
            </label>
            <textarea
              placeholder="write about yourself"
              rows={4}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md 
                         focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Add doctor
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
