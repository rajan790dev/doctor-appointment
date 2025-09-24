import React, { use, useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const ReleatedDoctors = ({docId,speciality}) => {
  const {doctors} = useContext(AppContext);
  const [relDoc,setRelDoc] = useState([]);
  const navigate = useNavigate();
  useEffect(()=>{
    const filteredDocs = doctors.filter(doc => doc.speciality === speciality && doc._id !== docId && doc.available===true);
    setRelDoc(filteredDocs);
  },[docId,speciality,doctors])

  return (
    <div>
      {relDoc.length>0 && <h2 className='text-2xl font-semibold mt-10 mb-4'>Related Doctors</h2>}
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {relDoc.map(doc=>(
          <div onClick={()=>{navigate(`/appointment/${doc._id}`); scrollTo(0,0)}}  key={doc._id} className='border border-gray-300 rounded-lg p-4 flex flex-col items-center bg-white cursor-pointer'>
            <img className='w-24 h-24 rounded-full object-cover' src={doc.image} alt={doc.name} />
            <h3 className='text-lg font-medium mt-2'>{doc.name}</h3>
            <p className='text-sm text-gray-600'>{doc.degree} - {doc.speciality}</p>
            <p className='text-sm text-gray-600 mt-1'>{doc.experience}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReleatedDoctors