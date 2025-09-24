import React, { useState, useEffect, useContext } from 'react';
import { Edit3, Save, User, Mail, Phone, MapPin, Calendar, Users } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

// Skeleton Loading Component
const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card Skeleton */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gray-300 to-gray-400 h-32 relative animate-pulse">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-300 animate-pulse"></div>
                <div className="absolute bottom-2 right-2 bg-gray-300 w-6 h-6 rounded-full border-2 border-white animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="pt-20 pb-8 px-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-8 bg-gray-300 rounded animate-pulse mb-2 w-64"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
              </div>
              
              <div className="h-12 bg-gray-300 rounded-full animate-pulse w-36"></div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information Card Skeleton */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gray-200 p-3 rounded-full animate-pulse">
                <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="h-6 bg-gray-300 rounded animate-pulse w-48"></div>
            </div>
            
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-5 h-5 bg-gray-300 rounded animate-pulse flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded animate-pulse mb-2 w-20"></div>
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Basic Information Card Skeleton */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gray-200 p-3 rounded-full animate-pulse">
                <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="h-6 bg-gray-300 rounded animate-pulse w-40"></div>
            </div>
            
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-5 h-5 bg-gray-300 rounded animate-pulse flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded animate-pulse mb-2 w-16"></div>
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-24"></div>
                  </div>
                </div>
              ))}
              
              <div className="bg-gray-100 rounded-xl p-4 mt-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-gray-300 rounded mb-2 w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyProfile = () => {
  const { currentUser ,editProfile} = useContext(AppContext);
  const [userData, setUserData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setUserData(currentUser);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentUser]);
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const submitHandler = () =>{
    setIsEdit(false) 
    editProfile(userData)
  }

  if (loading || !userData) return <ProfileSkeleton />;

  const handleInputChange = (field, value) => {
    if (field.startsWith('address.')) {
      const key = field.split('.')[1];
      setUserData(prev => ({
        ...prev,
        address: { ...(prev.address || {}), [key]: value }
      }));
    } else {
      setUserData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <img
                  src={userData.image}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
              </div>
            </div>
          </div>
          <div className="pt-20 pb-8 px-8 flex items-center justify-between">
            <div className="flex-1">
              {isEdit ? (
                <input
                  type="text"
                  value={userData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  className="text-3xl font-bold text-gray-800 bg-transparent border-b-2 border-blue-300 focus:border-blue-500 outline-none transition-colors"
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-800">{userData.name}</h1>
              )}
              <p className="text-gray-600 mt-2">Personal Profile</p>
            </div>
            <button
              onClick={isEdit ?submitHandler : () => setIsEdit(true)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                isEdit ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isEdit ? <><Save size={18}/> Save Changes</> : <><Edit3 size={18}/> Edit Profile</>}
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-full"><Mail className="text-blue-600" size={24} /></div>
              <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>
            </div>
            {[
              { label: 'Email', field: 'email', icon: Mail },
              { label: 'Phone', field: 'phone', icon: Phone, editable: true },
            ].map(info => (
              <div key={info.field} className="flex items-center gap-4">
                <info.icon className="text-gray-400 flex-shrink-0" size={20} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{info.label}</p>
                  {isEdit && info.editable ? (
                    <input
                      type="text"
                      value={userData[info.field] || ''}
                      onChange={e => handleInputChange(info.field, e.target.value)}
                      className="w-full text-gray-800 font-medium bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:bg-white outline-none transition-all"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{userData[info.field]}</p>
                  )}
                </div>
              </div>
            ))}
            {/* Address */}
            <div className="flex items-start gap-4">
              <MapPin className="text-gray-400 flex-shrink-0 mt-1" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Address</p>
                {isEdit ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={userData.address?.line1 || ''}
                      onChange={e => handleInputChange('address.line1', e.target.value)}
                      placeholder="Address Line 1"
                      className="w-full text-gray-800 font-medium bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:bg-white outline-none transition-all"
                    />
                    {/* <input
                      type="text"
                      value={userData.address?.line2 || ''}
                      onChange={e => handleInputChange('address.line2', e.target.value)}
                      placeholder="Address Line 2"
                      className="w-full text-gray-800 font-medium bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:bg-white outline-none transition-all"
                    /> */}
                  </div>
                ) : (
                  <div className="text-gray-800 font-medium">
                    <p>{userData.address?.line1 || ''}</p>
                    {/* <p>{userData.address?.line2 || ''}</p> */}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-full"><User className="text-purple-600" size={24} /></div>
              <h2 className="text-2xl font-bold text-gray-800">Basic Information</h2>
            </div>
            {/* Gender */}
            <div className="flex items-center gap-4">
              <Users className="text-gray-400 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Gender</p>
                {isEdit ? (
                  <select
                    value={userData.gender || ''}
                    onChange={e => handleInputChange('gender', e.target.value)}
                    className="w-full text-gray-800 font-medium bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:border-purple-500 focus:bg-white outline-none transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-800 font-medium">{userData.gender}</p>
                )}
              </div>
            </div>
            {/* DOB */}
            <div className="flex items-center gap-4">
              <Calendar className="text-gray-400 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Date of Birth</p>
                {isEdit ? (
                  <input
                    type="date"
                    value={userData.dob || ''}
                    onChange={e => handleInputChange('dob', e.target.value)}
                    className="w-full text-gray-800 font-medium bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:border-purple-500 focus:bg-white outline-none transition-all"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{formatDate(userData.dob)}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
