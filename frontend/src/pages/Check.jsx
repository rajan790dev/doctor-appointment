import React from 'react'
import { useState } from 'react';
import axios from "axios";
const Check = () => {
      const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // <-- yaha File object milta hai
  };
    const handleSubmit = async () => {
  try {
    const formData = new FormData();

    // text fields
    formData.append("name", "Rajan");
    formData.append("email", "test@gmail.com");
    formData.append("password", "123456789");
    formData.append("degree", "MBBS");
    formData.append("speciality", "Cardiology");
    formData.append("experience", "5 years");
    formData.append("about", "Specialist in heart care");
    formData.append("fees", "500");
const addressObj = {
  city: "Punjab",
  country: "India"
};
formData.append("address", JSON.stringify(addressObj));

    // file field (image select kar ke input se lena hoga)
    formData.append("image", selectedFile); // yeh selectedFile ek `File` object hoga

const res = await axios.post("http://localhost:4000/api/admin/add-doctor", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
    "atoken":"eyJhbGciOiJIUzI1NiJ9.YWRtaW5AcHJlc2NyaXB0by5jb21xd2VydHkxMjM.A0TRrRMx0RLdfofcQhqlqMcn-63bqaGyATiSxfjyMYs"
  },
});


    console.log("Response:", res.data);
  } catch (error) {
    console.error("Error:", error);
  }
};
  return (
    <>
        <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Upload</button>
    </div>
    </>
  )
}

export default Check