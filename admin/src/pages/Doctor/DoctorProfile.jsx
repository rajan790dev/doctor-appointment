import React, { useContext, useEffect, useState } from 'react';
import { Edit3, Save, MapPin, DollarSign, GraduationCap, Stethoscope, Clock } from 'lucide-react';
import { DoctorContext } from '../../context/DoctorContext';
import axios from 'axios';

const DoctorProfile = () => {
  const { dToken, getProfile, profileData,editProfile } = useContext(DoctorContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  
  useEffect(() => {
    if (dToken) {
      getProfile();
    }
  }, [dToken]);

  useEffect(() => {
    if (profileData) {
      setEditedData(profileData);
    }
  }, [profileData]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    editProfile(editedData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditedData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditedData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  if (!profileData) {
    return (
      <div className="w-full max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 bg-white min-h-screen">
        <div className="animate-pulse">
          <div className="bg-gray-300 h-32 sm:h-40 lg:h-48 rounded-xl sm:rounded-2xl mb-4 sm:mb-6"></div>
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-gray-300 h-4 sm:h-6 rounded w-3/4"></div>
            <div className="bg-gray-300 h-3 sm:h-4 rounded w-1/2"></div>
            <div className="bg-gray-300 h-16 sm:h-20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const currentData = isEditing ? editedData : profileData;

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 bg-white min-h-screen">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6 w-full sm:w-auto">
              <div className="relative mx-auto sm:mx-0 ">
                <img 
                  src={profileData.image} 
                  alt="Doctor Profile" 
                  className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full border-4 border-white shadow-lg object-cover min-w-20 min-h-20"
                />
                <div className={`absolute bottom-0 right-0 sm:bottom-1 sm:right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white ${currentData.available ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>
              <div className="text-white text-center sm:text-left w-full sm:w-auto">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{currentData.name}</h1>
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-4 mt-2 sm:mt-3">
                  <div className="flex items-center space-x-2">
                    <GraduationCap size={14} className="sm:hidden" />
                    <GraduationCap size={16} className="hidden sm:block" />
                    <span className="text-blue-100 text-xs sm:text-sm">{currentData.degree}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Stethoscope size={14} className="sm:hidden" />
                    <Stethoscope size={16} className="hidden sm:block" />
                    <span className="text-blue-100 text-xs sm:text-sm">{currentData.speciality}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={14} className="sm:hidden" />
                    <Clock size={16} className="hidden sm:block" />
                    <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      {currentData.experience}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={isEditing ? handleSave : handleEdit}
              className="bg-white/20 hover:bg-white/30 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 backdrop-blur-sm border border-white/30 w-full sm:w-auto text-sm sm:text-base cursor-pointer"
            >
              {isEditing ? (
                <>
                  <Save size={16} className="sm:hidden" />
                  <Save size={18} className="hidden sm:block" />
                  <span>Save Profile</span>
                </>
              ) : (
                <>
                  <Edit3 size={16} className="sm:hidden" />
                  <Edit3 size={18} className="hidden sm:block" />
                  <span>Edit</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="space-y-4 sm:space-y-6">
              {/* About Section */}
              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">About</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{currentData.about}</p>
              </div>

              {/* Availability Section */}
              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Availability</h3>
                <div className="flex items-center space-x-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentData.available || false}
                      onChange={(e) => handleInputChange('available', e.target.checked)}
                      disabled={!isEditing}
                      className="sr-only peer"
                    />
                    <div className={`relative w-10 h-6 sm:w-11 sm:h-6 rounded-full peer transition-colors duration-200 ${currentData.available ? 'bg-green-600' : 'bg-gray-300'} ${!isEditing ? 'opacity-75' : ''}`}>
                      <div className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-200 ${currentData.available ? 'transform translate-x-4 sm:translate-x-5' : ''}`}></div>
                    </div>
                  </label>
                  <span className={`font-medium text-sm sm:text-base ${currentData.available ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className="hidden sm:inline">{currentData.available ? 'Available for appointments' : 'Not available'}</span>
                    <span className="sm:hidden">{currentData.available ? 'Available' : 'Not available'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-6">
              {/* Fee Section */}
              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2 mb-3">
                  <DollarSign size={18} className="sm:hidden text-green-600" />
                  <DollarSign size={20} className="hidden sm:block text-green-600" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Appointment Fee</h3>
                </div>
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 text-lg sm:text-xl">$</span>
                    <input
                      type="number"
                      value={currentData.fees || ''}
                      onChange={(e) => handleInputChange('fees', parseInt(e.target.value) || 0)}
                      className="w-20 sm:w-24 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Fee"
                    />
                  </div>
                ) : (
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">${currentData.fees}</p>
                )}
              </div>

              {/* Address Section */}
              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin size={18} className="sm:hidden text-blue-600" />
                  <MapPin size={20} className="hidden sm:block text-blue-600" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Address</h3>
                </div>
                <div className="space-y-2">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={currentData.address?.line1 || ''}
                        onChange={(e) => handleInputChange('address.line1', e.target.value)}
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="Address Line 1"
                      />
                      <input
                        type="text"
                        value={currentData.address?.line2 || ''}
                        onChange={(e) => handleInputChange('address.line2', e.target.value)}
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="Address Line 2"
                      />
                    </>
                  ) : (
                    <div className="text-gray-600 text-sm sm:text-base">
                      <p className="leading-relaxed">{currentData.address?.line1}</p>
                      <p className="leading-relaxed">{currentData.address?.line2}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;