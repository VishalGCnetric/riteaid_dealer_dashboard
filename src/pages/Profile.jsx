import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FiEdit } from "react-icons/fi";
import { getAdminToken, getSellerDetails } from '../slices/sellerSlice';
import CoverOne from '../images/cover/cover-01.png';
import userSix from '../images/user/user-0.png';

const Profile = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
  
      try {
        // Fetch admin token first
       const adminToken= await dispatch(getAdminToken()).unwrap();
  if(adminToken){

    // Fetch seller details
    const response = await dispatch(getSellerDetails()).unwrap();
// console.log(response.data.seller)
    if (response?.data?.seller) {
      setUserData(response?.data);
    } else {
      throw new Error("Failed to fetch seller details");
    }
  }
      } catch (error) {
        console.error("Error fetching seller details:", error);
        setError(error.message || "Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [dispatch]);
  

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle cover image upload
      console.log('Cover image selected:', file);
    }
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle profile image upload
      console.log('Profile image selected:', file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error loading profile</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-sm border border-stroke bg-[#EAF1E0] shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="relative z-20 h-48 md:h-64">
        <img
          src={CoverOne}
          alt="profile cover"
          className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
        />
        <div className="absolute bottom-4 right-4 z-10">
          <label
            htmlFor="cover"
            className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90 transition-opacity"
          >
            <input 
              type="file" 
              name="cover" 
              id="cover" 
              className="sr-only" 
              onChange={handleCoverImageChange}
              accept="image/*"
            />
            <span>Edit Cover</span>
          </label>
        </div>
      </div>

      <div className="px-4 pb-6 lg:pb-8 xl:pb-11.5">
        <div className="relative z-30 mx-auto -mt-22 h-44 w-44 rounded-full bg-white/20 p-1 backdrop-blur">
          <div className="relative drop-shadow-2">
            <img 
              src={userSix } 
              alt="profile" 
              className="rounded-full w-full h-full object-cover dark:invert"
            />
            <label
              htmlFor="profile"
              className="absolute bottom-2 right-2 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 transition-opacity"
            >
              <span><FiEdit size={16}/></span>
              <input
                type="file"
                name="profile"
                id="profile"
                className="sr-only"
                onChange={handleProfileImageChange}
                accept="image/*"
              />
            </label>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-center">
            <div>
              <h3 className="mb-4 text-center text-2xl font-semibold text-black dark:text-white">
                {userData?.seller?.name || 'Shop Name'}
              </h3>
              <p className="mb-2 text-lg text-gray-600 dark:text-gray-400">
                Managed by: {`${userData?.administrator?.firstName }  ${userData?.administrator?.lastName}` || 'Owner Name'}
              </p>
              <p className="mb-2 text-lg text-gray-600 dark:text-gray-400">
                Phone: {userData?.seller?.customFields?.phoneNumber || 'Phone Number'}
              </p>
              <p className="mb-2 text-lg text-gray-600 dark:text-gray-400">
                Email: {userData?.administrator.emailAddress || 'Email Address'}
              </p>
              <p className="mb-4 text-lg text-gray-600 dark:text-gray-400">
                Organization: {userData?.seller?.customFields?.organization || 'Organization'}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col md:flex-row justify-evenly gap-4 border p-5 rounded-lg">
            <div className="flex-1 text-left px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md">
              <p className="mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
                Address:
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {userData?.seller?.customFields?.addressLine1 || 'Address Line 1'}
                {userData?.seller?.customFields?.addressLine2 && `, ${userData.seller?.customFields.addressLine2}`}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {userData?.seller?.customFields?.city || 'City'}
                {userData?.seller?.customFields?.province && `, ${userData.seller?.customFields.province}`}
                {userData?.seller?.customFields?.postalCode && ` - ${userData.seller?.customFields.postalCode}`}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Country: {userData?.seller?.customFields?.countryCode || 'Country'}
              </p>
              {userData?.seller?.customFields?.googleMapLink && (
                <a
                  href={userData.seller?.customFields.googleMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline mt-2 inline-block"
                >
                  View on Google Maps
                </a>
              )}
            </div>

            <div className="flex-1 text-left px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md">
              <p className="mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
                Additional Information:
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Aadhar No: {userData?.seller?.customFields?.aadharNo || 'N/A'}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                GST No: {userData?.seller?.customFields?.gstNo || 'N/A'}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                PAN No: {userData?.seller?.customFields?.panNo || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;